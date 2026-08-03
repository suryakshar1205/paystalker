# 🎯 PayStalker — Antigravity Agent Directives

## Overview
PayStalker is an autonomous, multi-channel dispute arbitrator and debt-recovery proxy engineered for the Caspian Buildathon. It interfaces seamlessly across **Discord**, **Email**, and **WhatsApp** to automate overdue invoice collections, deliverable dispute resolutions, and payment settlement workflows.

## Architectural Mandates
1. **Single Handler Architecture**:
   - All inbound events from Discord, Email, and WhatsApp MUST be processed inside a **SINGLE** `caspian.onMessage()` handler block in `src/index.ts`.
2. **AI Dispute Translation**:
   - Client feedback or complaints received via WhatsApp must be parsed and translated by Google Gemini (`@google/generative-ai` model `gemini-2.5-flash`) into structured technical bug reports before being posted to Discord.
3. **Decaying Incentive Engine**:
   - Initial collection triggers dispatch early-settlement incentive discounts (e.g., 10% off if paid within 24h) to maximize speedy recovery.
4. **Proof of Work Resolution**:
   - When a developer submits proof of completion on Discord, PayStalker resolves active disputes across all channels (notifying the client via WhatsApp and Email).
