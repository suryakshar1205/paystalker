# 🏆 PayStalker — Autonomous Multi-Channel Dispute Arbitrator & Debt-Recovery Proxy

> **Caspian 15-Day AI Agent Hackathon Submission**
> *"Your agent can think. It just can't reach anyone. Caspian gives it hands across Discord, Slack, and Email."*

![PayStalker Thumbnail](file:///C:/Users/surya/.gemini/antigravity-ide/brain/65834f21-4623-4202-a6d4-c3245907c97c/paystalker_thumbnail_1786386846004.png)

---

## 💡 The Problem & Creative Vision

Freelancers lose thousands of hours and billions of dollars chasing overdue invoices and dealing with emotional, disorganized client feedback. Most AI agents sit in a chat window waiting for a user. 

**PayStalker** is an autonomous multi-channel proxy agent that **actually reaches people where they live**. Built with `caspian-sdk` and **Google Gemini 1.5 Flash**, PayStalker acts as an impartial, multi-channel arbitrator across **Discord**, **Slack**, and **Email** inside a **SINGLE `caspian.onMessage()` handler**.

---

## 📐 Architecture & Flow

```
   +-----------------------------------------------------------------------+
   |                       FREELANCER INTERFACE                            |
   |                   Discord (#freelancer-devs)                          |
   +-----------------------------------------------------------------------+
                                   |          ^
                      !collect /   |          | Proof ACKS & 
                      Commands     v          | Settlement Alerts
   +-----------------------------------------------------------------------+
   |              PAYSTALKER UNIFIED CASPIAN ENGINE (src/index.ts)          |
   |              * Single caspian.onMessage() Event Handler               |
   |              * Dynamic Decaying Settlement Engine (2%/24h decay)      |
   |              * Gemini 1.5 Flash Multi-Tone Translator                 |
   +-----------------------------------------------------------------------+
                                   |          ^
               Dispatch Invoices   |          | Client Bugs & 
               & Reminders         v          | Deliverable Disputes
   +-----------------------------------------------------------------------+
   |                         CLIENT INTERFACES                             |
   |   Slack (Client Workspace Prompts) <---> Email (Executive Audit)       |
   +-----------------------------------------------------------------------+
```

---

## 🔥 Key Novel Features

### 1. Unified Multi-Channel Single-Handler Architecture
- Fully compliant with Caspian Hackathon rules: **Discord**, **Slack**, and **Email** are routed through **ONE single `caspian.onMessage()` handler** in [src/index.ts](file:///c:/Users/surya/Desktop/paystalker/src/index.ts).

### 2. Gemini 1.5 Flash Cross-Channel Multi-Tone Translator
- **Client Slack -> Developer Discord**: Translates emotional/vague Slack feedback into a structured technical bug report (`🐞 Reported Issue`, `💡 Client Demand`, `⚡ Recommended Action`).
- **Developer Discord -> Client Email & Slack**: Translates technical PR proof URLs into executive formal resolution notices and receipts.

### 3. Dynamic Decaying Settlement Engine
- Real-time time-decay calculation ([src/aiService.ts](file:///c:/Users/surya/Desktop/paystalker/src/aiService.ts#L94-L121)). Starts at 10% discount, decaying by 2% per 24 hours to maximize speedy recovery without fake/mocked mechanics.

### 4. Dynamic Multi-Tenant Invoice Lookup
- Intelligently matches incoming Slack/Email messages via explicit `INV-XXXX` tags or client email matching, preventing cross-client state collisions.

---

## ⚡ Quickstart & Live Demo for Judges

### 1. Installation
```bash
git clone https://github.com/suryakshar1205/paystalker.git
cd paystalker
npm install
```

### 2. Live Demo Simulation (Instant 30-Second Test)
Judges can instantly run the complete multi-channel workflow live without needing physical channel credentials:
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
CLIENT_EMAIL=client@example.com
CLIENT_SLACK=#client-discussions
```

Start the engine:
```bash
npm run build
npm start
```

---
