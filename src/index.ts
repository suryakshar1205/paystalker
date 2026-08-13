import 'dotenv/config';
import { Caspian, CaspianMessage } from './caspian-sdk.js';
import { Invoice } from './types.js';
import { 
  translateSlackToDiscordBug, 
  generateExecutiveResolutionEmail, 
  getDecayingDiscount 
} from './aiService.js';
import { runLiveSimulation } from './simulator.js';
import { startDashboardServer } from './server.js';

// Initialize Caspian client
const caspianApiKey = process.env.CASPIAN_API_KEY || 'demo-caspian-key';
const caspian = new Caspian({ apiKey: caspianApiKey });

// In-memory invoice store
export const activeInvoices = new Map<string, Invoice>();

// Target channels / addresses from environment
const FREELANCER_DISCORD_CHANNEL = process.env.FREELANCER_DISCORD_CHANNEL || 'discord-channel-id';
const DEFAULT_CLIENT_EMAIL = process.env.CLIENT_EMAIL || 'client@example.com';
const DEFAULT_CLIENT_SLACK = process.env.CLIENT_SLACK || '#client-discussions';

/**
 * Helper to match an active invoice dynamically by explicit ID in text or recent activity.
 */
function findTargetInvoice(msgText: string, senderId?: string): Invoice | undefined {
  // 1. Explicit ID in text matching INV-XXXX
  const invMatch = msgText.match(/INV-\d{4}/i);
  if (invMatch) {
    const matchedId = invMatch[0].toUpperCase();
    const inv = activeInvoices.get(matchedId);
    if (inv) return inv;
  }

  // 2. Dynamic Lookup: Return most recent active invoice (PENDING or DISPUTED_BUG)
  const activeList = Array.from(activeInvoices.values())
    .filter(inv => inv.status !== 'PAID' && inv.status !== 'REJECTED')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return activeList[0];
}

/**
 * MANDATORY CASPIAN HACKATHON REQUIREMENT:
 * Single caspian.onMessage() handler managing Discord, Slack, and Email
 * within one unified event loop.
 */
caspian.onMessage(async (msg: CaspianMessage) => {
  const content = (msg.content || '').trim();
  const channel = (msg.channel || '').toLowerCase(); // 'discord' | 'slack' | 'email'

  try {
    // -------------------------------------------------------------------------
    // A. FREELANCER INITIATION (Discord, message starts with "!collect")
    // -------------------------------------------------------------------------
    if (channel === 'discord' && content.startsWith('!collect')) {
      const parts = content.split(' ');
      const amountStr = parts[1] || '100';
      const clientEmail = parts[2] || DEFAULT_CLIENT_EMAIL;
      const description = parts.slice(3).join(' ') || 'Software Development Deliverable';
      const amount = parseFloat(amountStr);

      // Generate random 4-digit ID
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const invId = `INV-${randomId}`;

      const newInvoice: Invoice = {
        id: invId,
        amount,
        currentDiscountPercent: 10,
        clientEmail,
        clientSlack: DEFAULT_CLIENT_SLACK,
        description,
        status: 'PENDING',
        createdAt: new Date()
      };

      activeInvoices.set(invId, newInvoice);

      // Dynamic Decaying Discount Engine calculation
      const decayInfo = getDecayingDiscount(newInvoice.createdAt, amount);
      newInvoice.currentDiscountPercent = decayInfo.currentPercent;

      // DISPATCH 1 (Email): Formal payment notice with dynamic early-settlement incentive
      await caspian.send({
        channel: 'email',
        to: clientEmail,
        subject: `Payment Notice & Dynamic Early Discount: Invoice [${invId}]`,
        body: `Dear Client,\n\nAn invoice [${invId}] for "${description}" totaling $${amount} has been issued.\n\n⚡ Dynamic Early-Bird Incentive: Pay within 24 hours for ${decayInfo.currentPercent}% off ($${decayInfo.discountedAmount}). Note: Discount decays by 2% every 24 hours.\n\nThank you,\nPayStalker Automated Billing`
      });

      // DISPATCH 2 (Slack): Interactive client workspace notification
      await caspian.send({
        channel: 'slack',
        to: DEFAULT_CLIENT_SLACK,
        body: `🎯 PayStalker Target Acquired [${invId}]: Invoice of $${amount} issued for "${description}". Current early discount: ${decayInfo.currentPercent}% ($${decayInfo.discountedAmount}). Reply BUG if there is a deliverable issue.`
      });

      // ACKNOWLEDGE on Discord
      await caspian.send({
        channel: 'discord',
        to: msg.from || FREELANCER_DISCORD_CHANNEL,
        body: `🎯 PayStalker Target Acquired [${invId}]: Email & Slack dynamic decay offers sent (Current: ${decayInfo.currentPercent}% off).`
      });

      return;
    }

    // -------------------------------------------------------------------------
    // B. CLIENT DISPUTE / FEEDBACK (Slack / Email, message contains "bug" or "issue")
    // -------------------------------------------------------------------------
    if ((channel === 'slack' || channel === 'email') && (content.toLowerCase().includes('bug') || content.toLowerCase().includes('issue'))) {
      const targetInvoice = findTargetInvoice(content, msg.from);
      const invId = targetInvoice ? targetInvoice.id : 'INV-GENERAL';

      if (targetInvoice) {
        targetInvoice.status = 'DISPUTED_BUG';
        targetInvoice.dispute = {
          issueDescription: content,
          reportedAt: new Date()
        };
      }

      // Translate complaint into a structured technical bug report using Gemini 1.5 Flash
      const bugReport = await translateSlackToDiscordBug(content);

      // DISPATCH (Discord): Route translated report to freelancer Discord channel
      await caspian.send({
        channel: 'discord',
        to: FREELANCER_DISCORD_CHANNEL,
        body: `⚠️ CLIENT DISPUTE RECEIVED [${invId}]\n\n${bugReport}\n\nReply \`PROOF ${invId} <link>\` to submit proof of work.`
      });

      // Reply on client channel (Slack / Email) confirming feedback conversion
      await caspian.send({
        channel: channel,
        to: msg.from || (channel === 'email' ? DEFAULT_CLIENT_EMAIL : DEFAULT_CLIENT_SLACK),
        body: `✅ Feedback received for [${invId}]. Your report has been converted into a technical bug report for the developer team.`
      });

      return;
    }

    // -------------------------------------------------------------------------
    // C. FREELANCER PROOF OF WORK (Discord, message starts with "PROOF")
    // -------------------------------------------------------------------------
    if (channel === 'discord' && content.toUpperCase().startsWith('PROOF')) {
      const parts = content.split(' ');
      
      let invId = '';
      let proofUrl = '';

      if (parts[1] && parts[1].toUpperCase().startsWith('INV-')) {
        invId = parts[1].toUpperCase();
        proofUrl = parts[2] || 'https://github.com/deliverable-fix-proof';
      } else {
        proofUrl = parts[1] || 'https://github.com/deliverable-fix-proof';
        const activeTarget = findTargetInvoice(content);
        invId = activeTarget ? activeTarget.id : (Array.from(activeInvoices.keys())[0] || 'INV-1001');
      }

      const targetInvoice = activeInvoices.get(invId) || findTargetInvoice(content);

      if (targetInvoice) {
        targetInvoice.status = 'PAID';
        if (!targetInvoice.dispute) {
          targetInvoice.dispute = {
            issueDescription: 'Resolved via Discord Proof of Work',
            proofOfWorkUrl: proofUrl,
            reportedAt: new Date()
          };
        } else {
          targetInvoice.dispute.proofOfWorkUrl = proofUrl;
        }
      }

      const finalInvId = targetInvoice ? targetInvoice.id : invId;

      // DISPATCH (Slack): Send update to client workspace
      await caspian.send({
        channel: 'slack',
        to: (targetInvoice && targetInvoice.clientSlack) || DEFAULT_CLIENT_SLACK,
        body: `✅ Developer provided proof of completion for [${finalInvId}]: ${proofUrl}. Account closed.`
      });

      // DISPATCH (Email): Send formal resolution email using Gemini AI
      const clientEmail = (targetInvoice && targetInvoice.clientEmail) || DEFAULT_CLIENT_EMAIL;
      const resolutionEmailBody = await generateExecutiveResolutionEmail(finalInvId, proofUrl);

      await caspian.send({
        channel: 'email',
        to: clientEmail,
        subject: `Resolved & Settled: Invoice [${finalInvId}]`,
        body: resolutionEmailBody
      });

      // ACKNOWLEDGE on Discord
      await caspian.send({
        channel: 'discord',
        to: msg.from || FREELANCER_DISCORD_CHANNEL,
        body: `🎉 PayStalker Target Settled [${finalInvId}] across all channels!`
      });

      return;
    }
  } catch (error) {
    console.error('[PayStalker Core Engine Error]:', error);
  }
});

console.log('🚀 PayStalker Multi-Channel Arbitrator active (Discord, Slack, Email).');
console.log('💡 Tip for Judges: Run `npm run simulate` to execute the full multi-channel workflow live!');

// Launch Live Interactive Web Dashboard
startDashboardServer();
