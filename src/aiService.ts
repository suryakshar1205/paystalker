import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const hasValidKey = apiKey.startsWith('AIzaSy') && apiKey.length > 25;
const genAI = hasValidKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Translates raw client feedback/complaints from Slack or WhatsApp into a structured bug report for Discord.
 */
export async function translateSlackToDiscordBug(clientMsg: string): Promise<string> {
  if (!genAI) {
    return [
      `🐞 Reported Issue: ${clientMsg}`,
      `💡 Client Demand: Client requested immediate review of reported deliverable behavior`,
      `⚡ Recommended Action: Inspect codebase and submit proof of completion on Discord.`
    ].join('\n');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are PayStalker AI, an executive multi-channel dispute translator.
A client submitted the following feedback via Slack regarding a software deliverable:
"${clientMsg}"

Translate this into a concise, professional technical bug report formatted strictly as:
🐞 Reported Issue: <summary of technical issue>
💡 Client Demand: <what the client wants fixed or adjusted>
⚡ Recommended Action: <suggested technical fix or resolution action>

Do not include markdown code block ticks. Output only the formatted report.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || `🐞 Reported Issue: ${clientMsg}\n💡 Client Demand: Immediate review\n⚡ Recommended Action: Verify deliverable.`;
  } catch {
    return [
      `🐞 Reported Issue: ${clientMsg}`,
      `💡 Client Demand: Client requested fixes for reported behavior`,
      `⚡ Recommended Action: Inspect deliverable and respond with proof of work.`
    ].join('\n');
  }
}

// Alias for backward compatibility
export const translateWhatsAppToDiscordBug = translateSlackToDiscordBug;

/**
 * Generates a formal resolution email sent to the client after proof of work is provided on Discord.
 */
export async function generateExecutiveResolutionEmail(invId: string, proofUrl: string): Promise<string> {
  if (!genAI) {
    return `Subject: Resolution Notice - Invoice [${invId}]

Dear Client,

The deliverable updates for Invoice [${invId}] have been completed.
Verified Proof: ${proofUrl}

Thank you for your prompt settlement.

Best regards,
PayStalker Accounts Team`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are PayStalker AI, an executive accounts settlement manager.
Draft a formal, professional resolution email for Invoice ID "${invId}".
The developer has provided verified proof of completion/fix at URL: "${proofUrl}".

The email must:
1. Announce that the dispute/bug is resolved.
2. Provide the verified proof link.
3. Confirm the invoice state is settled.

Keep it polite, professional, and clear.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return `Subject: Resolution Notice - Invoice [${invId}]

Dear Client,

The deliverable updates for Invoice [${invId}] have been completed.
Verified Proof: ${proofUrl}

Thank you for your prompt settlement.

Best regards,
PayStalker Accounts Team`;
  }
}

/**
 * Calculates dynamic decaying discount based on invoice creation timestamp.
 * Discount starts at 10% and decays by 2% for every 24-hour period passed, down to 0%.
 */
export function getDecayingDiscount(createdAt: Date, originalAmount: number): {
  currentPercent: number;
  discountedAmount: number;
  daysPassed: number;
  hoursRemainingInPeriod: number;
} {
  const elapsedMs = Date.now() - createdAt.getTime();
  const hoursPassed = elapsedMs / (1000 * 60 * 60);
  const daysPassed = Math.floor(hoursPassed / 24);

  // Starts at 10%, drops by 2% per 24 hours, minimum 0%
  const currentPercent = Math.max(0, 10 - (daysPassed * 2));
  const discountedAmount = Number((originalAmount * (1 - currentPercent / 100)).toFixed(2));
  const hoursRemainingInPeriod = Math.max(0, 24 - Math.floor(hoursPassed % 24));

  return {
    currentPercent,
    discountedAmount,
    daysPassed,
    hoursRemainingInPeriod
  };
}
