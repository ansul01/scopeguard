# ScopeGuard PRO — Autonomous AI Scope Creep Monetization Platform

### AI First Hackathon 2026 · Round 2 (MVP Submission)
**Organised by:** IIT Jammu × Techible × I3C  
**Track:** Open Innovation — Build the Next AI Startup

---

## 1. Executive Summary & Problem Statement

Freelancers, agency owners, and technical consultants lose **15%–25% of annual revenue** to unbilled scope creep — client requests that gradually expand past signed agreements over informal channels (Slack, Email, WhatsApp) without formal change orders.

- **Target Audience:** Solo freelancers, technical contractors, and small agencies (2–10 members).
- **Core Problem:** Scope creep happens invisibly. Requests are casually phrased ("Could you also quickly add a blog?"), making traditional keyword rules fail, while freelancers avoid confrontation to preserve client relationships.
- **ScopeGuard Solution:** An autonomous AI agent that monitors client communications, semantically parses contract clauses against incoming messages using **OpenAI GPT-4o**, intercepts scope violations, and automates client-ready change order monetization.

---

## 2. Team & Registration Details

- **Team Name:** CodeCatalyst
- **Registration Number:** EV896e63aa615213
- **Event:** Summer School '26 — AI First Hackathon (IIT Jammu × Techible × I3C)

### Roster:
1. **Dilshan Pal Singh** (Team Lead) — `dilshanpal27singh@gmail.com` | `+91-8899965771`
2. **Sudhanshu Bhat** — `sudhanshubhat45@gmail.com` | `+91-9906311111`
3. **Ansul Mishra** — `ansulmishra.am@gmail.com` | `+91-9439889757`

---

## 3. Key Features & Capabilities (PRO MVP)

| Module | Features & Capabilities |
|---|---|
| **Industry Preset Selector** | 1-Click project profile switcher (Web Design, Mobile Banking App, Growth Marketing) with pre-configured scope contracts and test scenarios |
| **Ground Truth Contract Engine** | Visual Clause Inspector parsing scope text into indexed vector pills (Deliverables vs Exclusions) |
| **Strictness Control** | Adjustable AI sensitivity slider (Flexible, Standard, Strict Enforcement) |
| **Omni-Channel Inbox Simulator** | Multi-channel message audit interface (Slack #proj-channel, Email, WhatsApp Business) |
| **AI Semantic Guardrail** | GPT-4o direct integration with structured JSON outputs (Verdict, Confidence %, Risk Level, Effort Hours, Cost Delta) |
| **Client Reply Synthesizer** | Firm, polite, and professional AI-drafted replies designed to turn scope creep into billable revenue |
| **Scope Drift Matrix** | Live financial audit log with KPI cards (Unbilled Hours, Pending Approval, Protectable Revenue) |
| **Automated Monetization** | Instant Change Order Document Generator ready for client e-signature + CSV Export |
| **Interactive UX Delighters** | Floating particle canvas, Synthesizer Audio Engine (Web Audio API feedback), keyboard shortcuts |

---

## 4. Technology Stack & System Architecture

```
[Client Channels (Slack, Email, WhatsApp)]
                  │ (Webhook Message Payload)
                  ▼
       [ScopeGuard Neural Sentinel]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [Contract Clause    [Semantic Vector]
  Parser & Engine]   [Matching (RAG)]
        │                   │
        └─────────┬─────────┘
                  ▼
       [OpenAI GPT-4o Kernel]
                  │
                  ▼
  ┌───────────────┼───────────────┐
  ▼               ▼               ▼
[Verdict]  [Financial Delta] [Change Order]
 (96%)       ($600.00 / 8h)   (Monetized)
```

| Component | Technology Used |
|---|---|
| **AI Model Kernel** | OpenAI GPT-4o (`chat/completions` API with `json_object` enforcement) + Fallback High-Precision Semantic Engine |
| **Frontend Framework** | Pure Vanilla ES6 JavaScript, HTML5 Semantic Elements, CSS3 Custom Properties & Glassmorphic Design |
| **Design Aesthetics** | Plus Jakarta Sans & JetBrains Mono fonts, FontAwesome 6 icons, Web Audio API sound synthesizer, Canvas Particle System |
| **Vector Engine (Roadmap)** | PostgreSQL + `pgvector` for dense embedding storage |
| **Integrations (Roadmap)** | Slack Bolt SDK, Gmail API Webhooks, WhatsApp Cloud API, Stripe Invoicing |

---

## 5. How to Evaluate & Run the App

1. **Direct Browser Execution:** Open `index.html` in Google Chrome, Microsoft Edge, or Firefox.
2. **1-Click Auto Demo:** Click the **"1-Click Auto Demo"** button in the hero header to instantly run a live scope audit on a sample scope creep message.
3. **Try Industry Profiles:** Click between **Acme Corp Web**, **FinTech App**, or **Growth Marketing** to test different contract rules.
4. **Use OpenAI API Key:** Optional. Paste your OpenAI API key (`sk-proj-...`) in Step 1 to test live GPT-4o inference directly from your browser.
5. **Generate Change Order:** Go to Step 4 and click **Generate Official Change Order** to see the formatted scope amendment document.

---

## 6. Repository Structure

```
d:\PROJECTS\SS Hackthon\
├── index.html                  # Ultra-proficient app UI shell & structure
├── style.css                   # Glassmorphic design system, glow effects, responsive CSS
├── app.js                      # Core AI analysis engine, contract parser, preset profiles, audio engine
├── DOCUMENTATION.md            # Comprehensive project documentation
├── README.md                   # GitHub showcase repository document
└── ScopeGuard_SS26_AIH_Deck.pptx # Pitch presentation deck
```

---

## 7. Project Links

- **GitHub Repository:** [https://github.com/ansul01/scopeguard](https://github.com/ansul01/scopeguard)

---

*Built for AI First Hackathon 2026 · Round 2 MVP Submission · Team CodeCatalyst*
