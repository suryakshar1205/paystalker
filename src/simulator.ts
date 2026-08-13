import 'dotenv/config';
import { activeInvoices } from './index.js';
import { getDecayingDiscount, translateSlackToDiscordBug, generateExecutiveResolutionEmail } from './aiService.js';

/**
 * Live Multi-Channel Simulation Suite for Hackathon Judges.
 * Demonstrates the end-to-end autonomous flow across Discord, Slack, and Email
 * without requiring external API credentials.
 */
export async function runLiveSimulation() {
  console.log('\n================================================================');
  console.log('🏆 PAYSTALKER — LIVE CASPIAN MULTI-CHANNEL HACKATHON DEMO');
  console.log('================================================================\n');

  // Step 1: Freelancer Initiates Invoice Collection via Discord (!collect)
  console.log('🔹 [STEP 1] Freelancer issues command on Discord:');
  console.log('   `!collect 1500 client@acmecorp.com Mobile Checkout Redesign`');
  
  const invId = 'INV-8842';
  const amount = 1500;
  const createdAt = new Date();
  
  activeInvoices.set(invId, {
    id: invId,
    amount,
    currentDiscountPercent: 10,
    clientEmail: 'client@acmecorp.com',
    clientSlack: '#client-discussions',
    description: 'Mobile Checkout Redesign',
    status: 'PENDING',
    createdAt
  });

  const decay = getDecayingDiscount(createdAt, amount);

  console.log(`\n   ⚡ [PayStalker Engine] Generated Invoice ${invId}`);
  console.log(`   --> Dispatching Email to client@acmecorp.com: Payment Notice ($${amount}) with ${decay.currentPercent}% discount ($${decay.discountedAmount}).`);
  console.log(`   --> Dispatching Slack to #client-discussions: Interactive settlement prompt & dispute trigger.`);
  console.log(`   --> Discord ACK sent: 🎯 PayStalker Target Acquired [${invId}].`);

  // Step 2: Client files a deliverable complaint on Slack
  console.log('\n----------------------------------------------------------------');
  console.log('🔹 [STEP 2] Client sends complaint via Slack:');
  const clientSlackMsg = "Hey, the payment gateway crashes on iOS Safari when tapping pay!";
  console.log(`   Client Slack: "${clientSlackMsg}"`);

  console.log('\n   🤖 [Gemini AI Engine] Translating Slack complaint to Discord Technical Bug Format...');
  const translatedBug = await translateSlackToDiscordBug(clientSlackMsg);

  console.log('\n   --> Dispatching to Discord (#freelancer-dev-alerts):');
  console.log('   ------------------------------------------------------');
  console.log(`   ⚠️ CLIENT DISPUTE RECEIVED [${invId}]\n\n${translatedBug}\n\nReply \`PROOF ${invId} <link>\` to submit proof of work.`);
  console.log('   ------------------------------------------------------');

  // Step 3: Developer submits Proof of Completion on Discord
  console.log('\n----------------------------------------------------------------');
  console.log('🔹 [STEP 3] Developer submits fix proof on Discord:');
  const proofUrl = 'https://github.com/acme/checkout-repo/pull/42';
  console.log(`   Developer Discord: "PROOF ${invId} ${proofUrl}"`);

  console.log('\n   🤖 [Gemini AI Engine] Generating Executive Resolution Email...');
  const resolutionEmail = await generateExecutiveResolutionEmail(invId, proofUrl);

  console.log('\n   --> Dispatching Slack Resolution Notice to Client Workspace (#client-discussions):');
  console.log(`   "✅ Developer provided proof of completion for [${invId}]: ${proofUrl}. Account closed."`);

  console.log('\n   --> Dispatching Formal Executive Resolution Email to Client:');
  console.log('   ------------------------------------------------------');
  console.log(resolutionEmail);
  console.log('   ------------------------------------------------------');

  console.log('\n   --> Discord ACK sent: 🎉 PayStalker Target Settled [INV-8842] across all channels!');

  console.log('\n================================================================');
  console.log('✅ LIVE SIMULATION COMPLETE — ALL CHANNELS SYNCHRONIZED');
  console.log('================================================================\n');
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('simulator.ts')) {
  runLiveSimulation().catch(console.error);
}
