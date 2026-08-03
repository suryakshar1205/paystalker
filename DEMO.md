# 🏆 PayStalker — Hackathon Judges' Evaluation Guide

Welcome Caspian AI Hackathon Judges! This document provides a quickstart roadmap to evaluate **PayStalker**.

---

## ⚡ 30-Second Quickstart Evaluation (No API Keys Needed)

To allow instant evaluation without setting up Discord bot tokens or WhatsApp sandboxes, we built a **Live Multi-Channel Simulator** and an **Interactive Web Dashboard**:

### Option 1: Terminal Live Simulation
```bash
# 1. Install dependencies
npm install

# 2. Run instant multi-channel simulation
npm run simulate
```
*Outputs the complete 4-channel lifecycle live in the terminal (Invoice creation -> WhatsApp dispute -> Gemini AI translation -> Discord bug report -> Proof resolution).*

### Option 2: Live Web Visualizer Dashboard
```bash
# Start engine & dashboard
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the interactive dark-mode visualizer:
- **Interactive Action Buttons**: Test `!collect`, WhatsApp disputes, and Discord proof submissions with 1 click.
- **Real-Time Stream**: Watch real-time event cards populate across **Discord**, **WhatsApp**, **Email**, and **Telegram**.

---

## 📐 Hackathon Criteria Verification Checklist

| Criterion | Requirement | Implementation | Status |
| :--- | :--- | :--- | :---: |
| **SDK Usage** | Must use `caspian-sdk` | Integrated in [src/index.ts](file:///c:/Users/surya/Desktop/paystalker/src/index.ts) | ✅ PASSED |
| **Multi-Channel** | At least 2 supported channels | **4 Supported Channels** (Discord, WhatsApp, Email, Telegram) | ✅ EXCEEDED |
| **Single Handler** | Must run through a single `caspian.onMessage()` handler | Defined in [src/index.ts](file:///c:/Users/surya/Desktop/paystalker/src/index.ts#L62-L230) | ✅ PASSED |
| **Unmocked Mechanics** | Real time-decay & multi-tenant logic | `getDecayingDiscount()` & `findTargetInvoice()` in [src/aiService.ts](file:///c:/Users/surya/Desktop/paystalker/src/aiService.ts) | ✅ PASSED |
| **AI Integration** | Intelligent agent capabilities | Google Gemini 2.5 Flash for multi-tone translation | ✅ PASSED |

---

## 🎬 Video Pitch Script Summary

- **0:00 - 0:30**: **The Problem** (Overdue invoices & disorganized WhatsApp client complaints).
- **0:30 - 1:00**: **Multi-Channel Dispatch** (`!collect` on Discord -> Email & WhatsApp dispatch with dynamic decaying discounts).
- **1:00 - 1:30**: **Gemini AI Bug Translator** (WhatsApp complaint -> Gemini 2.5 Flash -> Discord Bug Report + Telegram Alert).
- **1:30 - 2:00**: **Resolution & Account Settlement** (`PROOF` on Discord -> WhatsApp & Email executive settlement certificate).
