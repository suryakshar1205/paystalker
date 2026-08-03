# 🎯 PayStalker — Caspian AI Hackathon Prompts

> A structured collection of system prompts designed for engineering **PayStalker** — an autonomous 4-channel dispute arbitrator and debt-recovery proxy built for the **Caspian 15-Day AI Agent Hackathon** using `caspian-sdk` and `@google/generative-ai`.

---

## 📚 Table of Contents

- [Prompt 1: Project Setup \& Dependency Boilerplate](#-prompt-1-project-setup--dependency-boilerplate)
- [Prompt 2: Gemini AI Dispute \& Translation Engine](#-prompt-2-gemini-ai-dispute--translation-engine)
- [Prompt 3: Core Caspian 4-Channel Single-Handler Engine](#-prompt-3-core-caspian-4-channel-single-handler-engine)
- [Prompt 4: Live Simulation \& Pitch Blueprint](#-prompt-4-live-simulation--pitch-blueprint)

---

## ⚙️ Prompt 1: Project Setup & Dependency Boilerplate

```text
Act as a Lead Systems Architect. Initialize a TypeScript Node.js project named "paystalker" engineered for the Caspian 15-Day AI Agent Hackathon using caspian-sdk and Google Gemini AI.

Create the following files in the workspace:

1. package.json:
   - Name: "paystalker"
   - Scripts: "build", "start", "dev", "simulate", "demo"
   - Dependencies: caspian-sdk, @google/generative-ai, dotenv
   - Dev Dependencies: typescript, tsx, @types/node

2. tsconfig.json:
   - Configured for modern Node.js (Target: ES2022, ModuleResolution: NodeNext, Strict mode enabled).

3. .env.example:
   CASPIAN_API_KEY=your_caspian_key
   GEMINI_API_KEY=your_gemini_key
   FREELANCER_DISCORD_CHANNEL=your_discord_channel_id
   FREELANCER_TELEGRAM_CHAT=@freelancer_alerts
   CLIENT_EMAIL=client@example.com
   CLIENT_WHATSAPP=whatsapp:+1234567890

4. GEMINI.md (Antigravity Directives):
   Create a directive file explaining that PayStalker is an autonomous 4-channel dispute arbitrator for the Caspian Hackathon using a SINGLE caspian.onMessage() handler across Discord, WhatsApp, Email, and Telegram.

5. src/types.ts:
   Define exported TypeScript interfaces:
   - InvoiceStatus: 'PENDING' | 'NEGOTIATING_DISCOUNT' | 'DISPUTED_BUG' | 'PAID' | 'REJECTED'
   - DisputeReport: issueDescription (string), proofOfWorkUrl (optional string), reportedAt (Date)
   - Invoice: id (string), amount (number), currentDiscountPercent (number), clientEmail (string), clientPhone (optional string), description (string), status (InvoiceStatus), dispute (optional DisputeReport), createdAt (Date).
```

---

## 🤖 Prompt 2: Gemini AI Dispute & Translation Engine

```text
Create src/aiService.ts using @google/generative-ai configured with model gemini-2.5-flash.

Implement and export three core functions:

1. translateWhatsAppToDiscordBug(clientMsg: string): Promise<string>
   - Analyzes raw client complaints or feedback from WhatsApp/Email.
   - Translates it into a structured, professional technical bug report for developers on Discord/Telegram.
   - Format:
     - 🐞 Reported Issue: <summary>
     - 💡 Client Demand: <what the client wants>
     - ⚡ Recommended Action: <suggested fix or discount offer>

2. generateExecutiveResolutionEmail(invId: string, proofUrl: string): Promise<string>
   - Generates a formal, professional resolution email sent to the client once proof of work is verified by the developer on Discord.

3. getDecayingDiscount(createdAt: Date, originalAmount: number): { currentPercent: number; discountedAmount: number; daysPassed: number; hoursRemainingInPeriod: number }
   - Dynamic Decaying Discount Engine: Calculates real elapsed time. Starts at 10% discount, decays by 2% per 24 hours down to 0%.
```

---

## ⚡ Prompt 3: Core Caspian 4-Channel Single-Handler Engine

```text
Create src/index.ts containing the core logic for PayStalker using caspian-sdk.

CRITICAL CASPIAN HACKATHON REQUIREMENT: All 4 channels (Discord, WhatsApp, Email, Telegram) MUST be handled inside a SINGLE caspian.onMessage() event handler to strictly comply with Caspian rules.

Implementation Details:

1. Import dotenv, Caspian from caspian-sdk, Invoice from ./types, and helpers from ./aiService.
2. Initialize caspian with process.env.CASPIAN_API_KEY.
3. Maintain an in-memory Map<string, Invoice>() named activeInvoices.
4. Implement findTargetInvoice(msgText: string, senderPhone?: string): Dynamic lookup matching explicit INV-XXXX IDs, sender phone numbers, or recent active invoices.

5. Implement caspian.onMessage(async (msg) => { ... }):

   A. FREELANCER INITIATION (Discord / Telegram, message starts with !collect):
      - Command format: !collect <amount> <clientEmail> <description>
      - Generate ID: INV-XXXX (random 4-digit number).
      - Create invoice record with dynamic early-bird discount (starts at 10%, decays 2% per 24h via getDecayingDiscount).
      - DISPATCH 1 (Email): Send formal notice via caspian.send() to clientEmail mentioning the $amount and dynamic early-settlement incentive.
      - DISPATCH 2 (WhatsApp): Send interactive message via caspian.send() to process.env.CLIENT_WHATSAPP: "PayStalker Target Acquired [INV-XXXX]: Pay within 24h for a dynamic discount. Reply BUG if there is a deliverable issue."
      - ACKNOWLEDGE: Reply on Discord / Telegram: "🎯 PayStalker Target Acquired [INV-XXXX]: Email & WhatsApp dynamic decay offers sent."

   B. CLIENT DISPUTE / FEEDBACK (WhatsApp / Email, message contains "bug" or "issue"):
      - Retrieve the target invoice dynamically via findTargetInvoice (matching INV-XXXX tag or sender phone number).
      - Set status to 'DISPUTED_BUG'.
      - Call translateWhatsAppToDiscordBug() to format the complaint.
      - DISPATCH (Discord): Route translated report to process.env.FREELANCER_DISCORD_CHANNEL:
        "⚠️ CLIENT DISPUTE RECEIVED [INV-XXXX]\n\n<formatted report>\n\nReply `PROOF INV-XXXX <link>` to submit proof of work."
      - DISPATCH (Telegram): High-priority alert ping to FREELANCER_TELEGRAM_CHAT.
      - Reply on client channel confirming feedback was converted to a technical bug report.

   C. FREELANCER PROOF OF WORK (Discord / Telegram, message starts with PROOF):
      - Extract target invId (from text or lookup) and proofUrl.
      - Update status to 'PAID'.
      - DISPATCH (WhatsApp): Send update to client: "✅ Developer provided proof of completion for [INV-XXXX]: <proofUrl>. Account closed."
      - DISPATCH (Email): Send formal resolution email using generateExecutiveResolutionEmail().
      - ACKNOWLEDGE: Reply on Discord & Telegram: "🎉 PayStalker Target Settled [INV-XXXX] across all channels!"
```

---

## 📝 Prompt 4: Live Simulation & Pitch Blueprint

```text
Create src/simulator.ts and README.md for the PayStalker Caspian Hackathon submission.

1. Implement src/simulator.ts:
   - Expose runLiveSimulation() allowing hackathon judges to execute an end-to-end 4-channel test run with 1 command (`npm run simulate`).

2. Include in README.md:
   - Caspian Hackathon Brief alignment ("Your agent has hands across 4 channels").
   - ASCII Flow Diagram showing Discord, Telegram, WhatsApp, and Email routing through one handler.
   - Quickstart Guide + Live Judge Demo instructions (`npm run simulate`).
   - 2-Minute Video Pitch Script.
```