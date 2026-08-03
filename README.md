# 🏆 PayStalker — Autonomous Multi-Channel Dispute Arbitrator & Debt-Recovery Proxy

> **Caspian 15-Day AI Agent Hackathon Submission**
> *"Your agent can think. It just can't reach anyone. Caspian gives it hands across Discord, WhatsApp, Email, and Telegram."*

---

## 💡 The Problem & Creative Vision

Freelancers lose thousands of hours and billions of dollars chasing overdue invoices and dealing with emotional, disorganized client feedback. Most AI agents sit in a chat window waiting for a user. 

**PayStalker** is an autonomous multi-channel proxy agent that **actually reaches people where they live**. Built with `caspian-sdk` and **Google Gemini 2.5 Flash**, PayStalker acts as an impartial, multi-channel arbitrator across **Discord**, **WhatsApp**, **Email**, and **Telegram** inside a **SINGLE `caspian.onMessage()` handler**.

---

## 📐 4-Channel Architecture & Flow

```
   +-----------------------------------------------------------------------+
   |                       FREELANCER INTERFACES                           |
   |   Discord (#freelancer-devs)   <--->   Telegram (@freelancer_alerts)   |
   +-----------------------------------------------------------------------+
                                   |          ^
                      !collect /   |          | Proof ACKS & 
                      Commands     v          | Urgent Dispute Pings
   +-----------------------------------------------------------------------+
   |              PAYSTALKER UNIFIED CASPIAN ENGINE (src/index.ts)          |
   |              * Single caspian.onMessage() Event Handler               |
   |              * Dynamic Decaying Settlement Engine (2%/24h decay)      |
   |              * Gemini 2.5 Flash Multi-Tone Translator                 |
   +-----------------------------------------------------------------------+
                                   |          ^
               Dispatch Invoices   |          | Client Bugs & 
               & Reminders         v          | Deliverable Disputes
   +-----------------------------------------------------------------------+
   |                         CLIENT INTERFACES                             |
   |   WhatsApp (Interactive Prompts) <---> Email (Formal Executive Audit) |
   +-----------------------------------------------------------------------+
```

---

## 🔥 Key Novel Features

### 1. Unified 4-Channel Single-Handler Architecture
- Fully compliant with Caspian Hackathon rules: **Discord**, **WhatsApp**, **Email**, and **Telegram** are routed through **ONE single `caspian.onMessage()` handler** in [src/index.ts](file:///c:/Users/surya/Desktop/paystalker/src/index.ts).

### 2. Gemini 2.5 Flash Cross-Channel Multi-Tone Translator
- **Client WhatsApp -> Developer Discord**: Translates emotional/vague WhatsApp feedback into a structured technical bug report (`🐞 Reported Issue`, `💡 Client Demand`, `⚡ Recommended Action`).
- **Developer Discord -> Client Email & WhatsApp**: Translates technical PR proof URLs into executive formal resolution notices and receipts.

### 3. Dynamic Decaying Settlement Engine
- Real-time time-decay calculation ([src/aiService.ts](file:///c:/Users/surya/Desktop/paystalker/src/aiService.ts#L94-L121)). Starts at 10% discount, decaying by 2% per 24 hours to maximize speedy recovery without fake/mocked mechanics.

### 4. Dynamic Multi-Tenant Invoice Lookup
- Intelligently matches incoming WhatsApp/Email messages via explicit `INV-XXXX` tags or sender phone matching, preventing cross-client state collisions.

---

## ⚡ Quickstart & Live Demo for Judges

### 1. Installation
```bash
git clone https://github.com/your-username/paystalker.git
cd paystalker
npm install
```

### 2. Live Demo Simulation (Instant 30-Second Test)
Judges can instantly run the complete 4-channel workflow live without needing 4 physical phones:
```bash
npm run simulate
# OR
npm run demo
```

### 3. Running with Caspian & Gemini Keys
Create `.env`:
```env
CASPIAN_API_KEY=your_caspian_key
GEMINI_API_KEY=your_gemini_key
FREELANCER_DISCORD_CHANNEL=your_discord_channel_id
FREELANCER_TELEGRAM_CHAT=@freelancer_alerts
CLIENT_EMAIL=client@example.com
CLIENT_WHATSAPP=whatsapp:+1234567890
```

Start the engine:
```bash
npm run build
npm start
```

---

## 🎬 2-Minute Pitch & Demonstration Script

- **0:00 - 0:30**: **The Problem** — Show freelancers overwhelmed by unpaid invoices & WhatsApp complaints.
- **0:30 - 1:00**: **Multi-Channel Dispatch** — Developer types `!collect 1500 client@acme.com Landing Page` on Discord. PayStalker dispatches dynamic discount emails and WhatsApp interactive notices.
- **1:00 - 1:30**: **AI Dispute Arbitration** — Client replies on WhatsApp with a complaint. Gemini 2.5 Flash formats it into a developer bug report on Discord and pings Telegram.
- **1:30 - 2:00**: **Autonomous Settlement** — Developer submits `PROOF INV-8842 <link>` on Discord. PayStalker updates WhatsApp and sends formal executive emails closing the account.
