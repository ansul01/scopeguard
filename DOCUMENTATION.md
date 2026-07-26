# ScopeGuard — Project Documentation
### AI First Hackathon 2026 · SS26 · IIT Jammu × Techible × I3C
**Track:** Open Innovation — Build the Next AI Startup

---

## 1. Problem Statement

Freelancers and small agencies (2–10 people) silently absorb **15–20% of their billable time** through scope creep — client requests that gradually expand past the signed agreement over Slack messages and emails, with zero systematic tracking.

**Who is affected:** Solo freelancers, consultants, and small agencies with no dedicated project manager.

**What's broken today:** Client requests creep past the signed scope over informal channels, with no systematic comparison or audit trail.

**Why it matters now:** The global freelance economy is projected to exceed $500B. Unbilled scope creep is the #1 cited pain point — yet no dedicated AI tool addresses it.

**If unsolved:** Freelancers keep absorbing unpaid work, quietly eroding project margins and eventually client trust.

---

## 2. Solution — ScopeGuard

ScopeGuard is an **AI-powered scope creep detection agent** that:
1. Ingests the freelancer's signed scope of work once
2. Semantically compares every incoming client message against it in real time
3. Flags out-of-scope requests, logs them with timestamps, and drafts professional billing replies

> "AI that catches scope creep before it costs you your billable hours."

---

## 3. Key Features (MVP)

| Feature | Description |
|---|---|
| **Scope Document Upload** | Paste any scope-of-work document; the system indexes all deliverables, boundaries, and timelines |
| **AI Message Analysis** | Uses Claude API for semantic comparison — catches casual, indirectly-phrased requests that keyword rules miss |
| **Confidence Scoring** | Every message gets a verdict (IN SCOPE / OUT OF SCOPE / POTENTIAL CREEP) with a confidence percentage |
| **Drift Log** | All flagged items are timestamped and logged with severity, estimated hours, and billing status |
| **AI Draft Replies** | Polite, professional reply drafts generated automatically for one-click approval |
| **Change Order Generator** | Converts unbilled drift log items into a professional PDF-ready change order document |
| **CSV Export** | Full drift log exportable for invoicing tools |
| **Demo Mode** | Fully functional without an API key — uses rule-based semantic demo engine |

---

## 4. How AI is Integrated

**Model:** Anthropic Claude API (claude-opus-4-5)

**Method:** The system uses a structured prompt that:
- Presents the full signed scope document as context
- Submits the client message for evaluation
- Requests a structured JSON response with verdict, confidence, reasoning, and a draft reply

**Why Claude and not keyword matching:**
Clients rarely say *"I want something outside scope."* They say things like:
> *"Could you also just quickly add a blog?"*
> *"Can you make the logo a bit more modern while you're at it?"*

Semantic reasoning (not rules) is required to reliably catch these requests. Claude's language understanding classifies intent even when phrased casually or indirectly.

**Future — RAG with pgvector:**
The production architecture uses retrieval-augmented generation with pgvector embeddings to scale scope matching across multi-project portfolios without re-reading the full document each time.

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| **AI / Model** | Claude API (Anthropic) — semantic classification & reply drafting |
| **MVP Frontend** | HTML5, Vanilla CSS, JavaScript (no build step — instant demo) |
| **Production Frontend** | React + Tailwind CSS |
| **Backend** | Node.js / FastAPI (Python) |
| **Database** | PostgreSQL + pgvector for semantic search |
| **Integrations** | Slack API, Gmail API (OAuth), Stripe API for billing |
| **Hosting** | AWS / Vercel |

---

## 6. Innovation & Differentiation

| Competitor | Gap ScopeGuard Fills |
|---|---|
| **Asana / Trello** | Built for teams with PMs — not solo freelancers; no scope comparison |
| **Harvest / Bonsai** | Track time/invoices *after* the fact — don't prevent revenue loss |
| **Zapier automations** | Keyword-based, rigid — miss casual or indirect scope requests |
| **ScopeGuard** | Purpose-built, passive, AI-first, semantic — catches creep *before* it's absorbed |

**Key innovations:**
- **Passive monitoring** — no dashboard to check; runs in the background
- **Semantic AI** — intent-based analysis, not brittle keyword rules
- **Human-in-the-loop** — all replies require freelancer approval before sending
- **Dual mode** — works instantly with demo mode; upgrades to real AI with API key

---

## 7. Feasibility & Scalability

### MVP Feasibility
- Built in under 48 hours using entirely off-the-shelf APIs
- No custom model training required
- Single HTML/CSS/JS file — zero build step, runs in any browser

### Path to Production
```
MVP (Hackathon) → Beta (Slack bot + Chrome extension) → SaaS (full platform)
```

**Phase 1 (0–3 months):** Browser-based MVP, manual message paste, Slack webhook integration
**Phase 2 (3–6 months):** OAuth Slack + Gmail integration, real-time monitoring, mobile app
**Phase 3 (6–12 months):** Multi-project, team accounts, Stripe auto-invoicing, white-label API

### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| False positives flagging in-scope items | Tunable sensitivity slider; human confirmation before any action |
| Client discomfort at being "monitored" | Transparent opt-in framing as a "scope assistant," not surveillance |
| Data privacy of reading client messages | End-to-end encryption, minimal retention, GDPR-compliant design |
| LLM hallucination in classifications | Confidence scores + human review step before reply is sent |

---

## 8. Business Model

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | 20 message analyses/month, 1 project |
| **Solo** | $12/month | Unlimited analyses, Slack integration, drift log export |
| **Agency** | $39/month | Multi-client, team seats, white-label change orders, priority support |

**Revenue projection:** At 1,000 Solo users → $12K MRR in Year 1

---

## 9. How to Run the MVP

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge)
- Optional: Anthropic API key for real AI analysis (demo mode works without it)

### Steps
```
1. Open index.html in your browser
2. (Optional) Enter your Anthropic API key in the API Key field
3. The sample scope is pre-loaded — click "Save & Activate Scope"
4. Go to Step 2 — click "Load Samples" to pick a client message
5. Click "Analyse Message" to see the AI verdict
6. Click "Add to Drift Log" for out-of-scope items
7. Go to Drift Log → "Load Demo Data" to see a full populated view
8. Go to Billing → set your rate → "Generate Change Order"
```

### With Real Claude API
- Enter your Anthropic API key (sk-ant-...)
- The system calls `claude-opus-4-5` directly from the browser
- All analysis is real-time semantic AI, not demo rules

---

## 10. Team Details

**Team Name:** [To be filled]
**College / Institution:** [To be filled]
**Members:** [To be filled]
**Contact:** [To be filled]
**Mentor:** [To be filled]

---

## 11. Links

- **GitHub Repository:** [To be added]
- **Demo Video:** [To be added]
- **Live Demo:** Open `index.html` directly in any browser

---

*Built for AI First Hackathon 2026 · SS26 · IIT Jammu × Techible × I3C*
*Development Window: July 23–26, 2026*
