# 🛡️ ScopeGuard — AI Scope Creep Detector

> **AI that catches scope creep before it costs you your billable hours.**

[![Hackathon](https://img.shields.io/badge/AI%20First%20Hackathon-2026-6366f1?style=flat-square)](https://summerschool.iitjammu.ac.in)
[![IIT Jammu](https://img.shields.io/badge/IIT%20Jammu-SS26-06b6d4?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Model](https://img.shields.io/badge/AI-GPT--4o-10b981?style=flat-square)]()

---

## 🚀 What is ScopeGuard?

Freelancers lose **15–20% of billable time** to scope creep they can't prove — client requests that silently expand past the signed agreement over Slack and email, with no audit trail.

**ScopeGuard** is an AI-powered tool that:
- 📄 Ingests your signed scope of work
- 🔍 Semantically analyses every client message against it using **GPT-4o**
- 🚨 Flags out-of-scope requests with confidence scores
- 💬 Auto-drafts polite, professional billing replies
- 📊 Maintains a timestamped **Drift Log** of all creep
- 📑 Generates a **Change Order** document for unbilled work

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Message Analysis** | GPT-4o semantic comparison — catches casual, indirect requests |
| **Confidence Scoring** | IN SCOPE / OUT OF SCOPE / POTENTIAL CREEP with % confidence |
| **Drift Log** | Timestamped log with severity, hours, and billing status |
| **AI Draft Replies** | Professional reply drafts, one-click copy |
| **Change Order Generator** | Converts unbilled items into a formal document |
| **CSV Export** | Export drift log for invoicing tools |
| **Demo Mode** | Fully functional without an API key |

---

## 🎮 Quick Start

### No setup required
```
1. Clone or download this repo
2. Open index.html in any modern browser
3. (Optional) Enter your OpenAI API key for real AI analysis
4. Click "Load Samples" → pick a message → "Analyse Message"
```

### With Real AI (GPT-4o)
1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Paste it in the **OpenAI API Key** field in the app
3. Analyse any client message with live GPT-4o analysis

> 💡 Demo mode works without any API key — great for judging/evaluation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI** | OpenAI GPT-4o (via REST API) |
| **Frontend** | HTML5, Vanilla CSS, JavaScript |
| **Production (planned)** | React + FastAPI + PostgreSQL + pgvector |
| **Integrations (planned)** | Slack API, Gmail API, Stripe |

---

## 📁 Project Structure

```
scopeguard/
├── index.html          # Main application
├── style.css           # Dark premium UI styles
├── app.js              # AI logic, drift log, billing
├── DOCUMENTATION.md    # Full project documentation
└── README.md           # This file
```

---

## 🏆 Hackathon

**Event:** AI First Hackathon 2026 — Round 2 (MVP Submission)  
**Organised by:** IIT Jammu × Techible × I3C  
**Track:** Open Innovation — Build the Next AI Startup  
**Development Window:** July 23–26, 2026

---

## 📄 License

MIT © 2026 — ScopeGuard Team
