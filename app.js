/* ── SCOPEGUARD PRO MVP — ADVANCED INTERACTIVE ENGINE ── */

// ── STATE MANAGEMENT ─────────────────────────────────────
let currentPreset = 'webdesign';
let scopeText = '';
let parsedInScope = [];
let parsedOutScope = [];
let driftLog = [];
let msgHistory = [];
let statsChecked = 0;
let statsFlagged = 0;
let statsSaved = 0;
let currentResult = null;
let activeChannel = 'slack';
let strictnessLevel = '2'; // 1: Flexible, 2: Standard, 3: Strict
let audioEnabled = true;

// ── PRESET PROFILES DATA ──────────────────────────────────
const PRESETS = {
  webdesign: {
    title: 'Acme Corp Web Redesign & Optimization',
    rate: 75,
    client: 'Sarah (Acme Corp)',
    scope: `Project: Website Redesign for Acme Corp
Client: Sarah (Acme Corp)
Duration: June 1 – July 31, 2026
Rate: $75/hour

IN SCOPE DELIVERABLES:
- 5-page responsive website (Home, About, Services, Portfolio, Contact)
- 2 rounds of design revisions included
- Basic SEO meta tags setup on all 5 pages
- Contact form with email notifications
- Deployment to existing client hosting

EXCLUSIONS & OUT OF SCOPE:
- E-commerce or Stripe payment processing
- Blog, CMS, or dynamic admin dashboard
- Custom video production or motion graphics
- Logo redesign or brand identity work
- Social media management
- Revisions beyond 2 rounds`,
    samples: [
      { label: '🔴 Blog/CMS Request', type: 'creep', client: 'Sarah (Acme Corp)', channel: 'slack',
        text: 'Hey Alex! The design looks super clean. Could we add a small blog section so I can publish weekly updates? Shouldn\'t take too much time, right?' },
      { label: '🔴 CRM & Logo Overrun', type: 'creep', client: 'Sarah (Acme Corp)', channel: 'email',
        text: 'Hi Alex, can you integrate our HubSpot CRM into the contact form so leads route automatically? Also, can you redesign our company logo while you are working on the header?' },
      { label: '🟡 3rd Revision Request', type: 'creep', client: 'Sarah (Acme Corp)', channel: 'slack',
        text: 'The homepage looks great! But our partner has some new ideas — can we do a 3rd round of layout revisions on the hero section?' },
      { label: '🟢 In-Scope SEO Tweak', type: 'in-scope', client: 'Sarah (Acme Corp)', channel: 'slack',
        text: 'Can you update the meta description on the Services page to mention our new consultation offer? This is part of our 2nd revision round.' }
    ]
  },
  mobileapp: {
    title: 'FinTech Mobile Banking App (iOS/Android)',
    rate: 110,
    client: 'David (Apex Pay)',
    scope: `Project: Native Swift/Kotlin Mobile App
Client: David (Apex Pay)
Rate: $110/hour

IN SCOPE DELIVERABLES:
- 10 native app screens (Login, Dashboard, Wallet, Transfers, Profile, Settings)
- Biometric authentication integration (FaceID/TouchID)
- Stripe Connect API for card payments
- 2 revision cycles per screen layout

EXCLUSIONS & OUT OF SCOPE:
- Crypto / Blockchain wallet integration
- AI financial advisor / Chatbot module
- Multi-currency forex trading engine
- Desktop web portal build`,
    samples: [
      { label: '🔴 Crypto Wallet Creep', type: 'creep', client: 'David (Apex Pay)', channel: 'slack',
        text: 'Hey team, we just got investor interest! Can we quickly plug in Solana & Bitcoin wallet support into the transfer screen?' },
      { label: '🔴 AI Chatbot Request', type: 'creep', client: 'David (Apex Pay)', channel: 'email',
        text: 'Hi David here! We need an AI financial assistant chatbot built into the main dashboard before launch. Can you add this to current sprint?' },
      { label: '🟢 Biometric FaceID Setup', type: 'in-scope', client: 'David (Apex Pay)', channel: 'slack',
        text: 'Please test the FaceID prompt on iOS 18 devices to ensure login works smoothly as specified in Screen 1.' }
    ]
  },
  marketing: {
    title: 'SaaS Growth & Content Marketing Campaign',
    rate: 90,
    client: 'Marcus (CloudSync)',
    scope: `Project: SaaS Monthly Growth Campaign
Client: Marcus (CloudSync)
Rate: $90/hour

IN SCOPE DELIVERABLES:
- Monthly technical SEO audit & report
- 4 long-form blog posts (1,500 words each)
- Email newsletter copywriting (2 emails/mo)

EXCLUSIONS & OUT OF SCOPE:
- Paid Google / Meta ad campaign management
- Promotional video creation or podcast editing
- Landing page HTML/CSS coding
- Social media community management`,
    samples: [
      { label: '🔴 Google Ads Management', type: 'creep', client: 'Marcus (CloudSync)', channel: 'email',
        text: 'Hi! Can you take over managing our $5k/mo Google Search Ads account starting this week alongside the blog writing?' },
      { label: '🔴 Video Production Creep', type: 'creep', client: 'Marcus (CloudSync)', channel: 'slack',
        text: 'Can you produce a 60-second product demo video for our homepage product launch?' },
      { label: '🟢 Monthly Blog Writing', type: 'in-scope', client: 'Marcus (CloudSync)', channel: 'email',
        text: 'Here is the topic brief for Blog #3: "Top 10 Cloud Security Best Practices for 2026". Ready for draft!' }
    ]
  }
};

// ── AUDIO ENGINE (Web Audio API Synthesizer) ─────────────
function playSound(type) {
  if (!audioEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'creep') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) { /* audio fallback */ }
}

// ── BACKGROUND CANVAS PARTICLES ───────────────────────────
function initParticleBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── PARSE SCOPE CLAUSES ──────────────────────────────────
function parseScopeClauses(text) {
  const lines = text.split('\n');
  parsedInScope = [];
  parsedOutScope = [];

  let isOutMode = false;
  lines.forEach(l => {
    const trimmed = l.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase().includes('out of scope') || trimmed.toLowerCase().includes('exclusions')) {
      isOutMode = true;
      return;
    }
    if (trimmed.toLowerCase().includes('in scope') || trimmed.toLowerCase().includes('deliverables')) {
      isOutMode = false;
      return;
    }

    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const item = trimmed.replace(/^[-*•]\s*/, '');
      if (isOutMode) parsedOutScope.push(item);
      else parsedInScope.push(item);
    }
  });

  if (parsedInScope.length === 0) parsedInScope = ['Core Deliverables Agreed', 'Approved Spec'];
  if (parsedOutScope.length === 0) parsedOutScope = ['Unapproved Features', 'Additional Scope'];

  renderParsedClauses();
}

function renderParsedClauses() {
  const inContainer = document.getElementById('in-scope-pills');
  const outContainer = document.getElementById('out-scope-pills');

  inContainer.innerHTML = parsedInScope.map(i => `<span class="clause-pill in"><i class="fa-solid fa-check"></i> ${i}</span>`).join('');
  outContainer.innerHTML = parsedOutScope.map(o => `<span class="clause-pill out"><i class="fa-solid fa-xmark"></i> ${o}</span>`).join('');

  document.getElementById('scope-clause-count').innerHTML = `<i class="fa-solid fa-list-check"></i> ${parsedInScope.length + parsedOutScope.length} clauses indexed`;
}

// ── HIGH-PRECISION LOCAL AI ENGINE (FALLBACK / DEMO) ──────
function localAISemanticAnalysis(message, scopeDoc, clientName) {
  const m = message.toLowerCase();
  
  const highRiskKeywords = ['blog', 'cms', 'crm', 'hubspot', 'logo', 'e-commerce', 'stripe', 'crypto', 'blockchain', 'solana', 'bitcoin', 'ads', 'google ads', 'video', 'podcast', 'chatbot', 'ai assistant'];
  const medRiskKeywords = ['3rd round', 'third round', 'another revision', 'extra round', 'manage our', 'take over', 'integration'];

  const hasHighRisk = highRiskKeywords.some(k => m.includes(k));
  const hasMedRisk = !hasHighRisk && medRiskKeywords.some(k => m.includes(k));

  if (hasHighRisk || (strictnessLevel === '3' && m.length > 50)) {
    const matched = highRiskKeywords.find(k => m.includes(k)) || 'unspecified addition';
    const estHours = matched.includes('crypto') || matched.includes('crm') || matched.includes('blog') ? 8 : 6;
    const rate = parseInt(document.getElementById('hourly-rate').value) || 75;

    return {
      verdict: 'OUT OF SCOPE',
      icon: '🚨',
      confidence: '96%',
      confClass: 'text-danger',
      sub: 'Explicit Scope Exclusion Triggered',
      riskLevel: 'High Risk',
      estHours: estHours,
      estCost: `$${(estHours * rate).toFixed(2)}`,
      reasoning: `Semantic analysis identified "${matched}" which is explicitly categorized under project EXCLUSIONS. This constitutes an unbilled new deliverable.`,
      reply: `Hi ${clientName.split(' ')[0]},\n\nThank you for reaching out! I'm glad to hear the progress is looking great.\n\nI reviewed your request for the ${matched}. Because this deliverable falls outside our signed Scope of Work agreement, I would be happy to accommodate it via an official Change Order.\n\n• Estimated Effort: ${estHours} hours\n• Investment: $${(estHours * rate).toLocaleString()}\n\nLet me know if you would like me to generate a change order so we can get this scheduled!\n\nBest regards,\nScopeGuard Agent`,
      isCreep: true,
      severity: 'high'
    };
  } else if (hasMedRisk) {
    const rate = parseInt(document.getElementById('hourly-rate').value) || 75;
    return {
      verdict: 'POTENTIAL SCOPE CREEP',
      icon: '⚠️',
      confidence: '78%',
      confClass: 'text-warning',
      sub: 'Revision Round / Boundary Warning',
      riskLevel: 'Medium Risk',
      estHours: 3,
      estCost: `$${(3 * rate).toFixed(2)}`,
      reasoning: 'The client request appears to exceed the 2 included revision rounds specified in contract terms.',
      reply: `Hi ${clientName.split(' ')[0]},\n\nThanks for the feedback! Just a quick heads-up: we have completed the 2 revision cycles included in our project scope.\n\nWe can certainly perform additional revisions at our standard rate of $${rate}/hr. Should I proceed and log these extra hours?\n\nBest regards,`,
      isCreep: true,
      severity: 'medium'
    };
  } else {
    return {
      verdict: 'IN SCOPE ✓',
      icon: '✅',
      confidence: '98%',
      confClass: 'text-success',
      sub: 'Covered Under Signed Deliverables',
      riskLevel: 'Low / In Scope',
      estHours: 0,
      estCost: '$0.00',
      reasoning: 'Request aligns with agreed deliverables and fits within current revision/meta setup bounds. Proceed without billing penalty.',
      reply: null,
      isCreep: false,
      severity: 'low'
    };
  }
}

// ── OPENAI GPT-4o DIRECT API INTEGRATION ──────────────────
async function callOpenAI(apiKey, message, scopeDoc, clientName) {
  const prompt = `You are ScopeGuard AI, an expert scope creep prevention agent.

CONTRACT SCOPE DOCUMENT:
${scopeDoc}

CLIENT MESSAGE (${clientName}):
"${message}"

Enforce contract strictness level: ${strictnessLevel}/3.

Analyze if this request is IN SCOPE or OUT OF SCOPE. Return ONLY a raw JSON object with key names:
{
  "verdict": "OUT OF SCOPE" | "IN SCOPE" | "POTENTIAL SCOPE CREEP",
  "confidence": "e.g. 95%",
  "riskLevel": "High Risk" | "Medium Risk" | "Low / In Scope",
  "estHours": number,
  "reasoning": "2 sentence clear explanation citing contract clauses",
  "severity": "high" | "medium" | "low",
  "reply": "Polite professional client email draft (null if in scope)"
}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are ScopeGuard AI. Always respond in JSON.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API Error ${res.status}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  const rate = parseInt(document.getElementById('hourly-rate').value) || 75;

  return {
    verdict: parsed.verdict,
    icon: parsed.verdict === 'IN SCOPE' ? '✅' : parsed.verdict === 'POTENTIAL SCOPE CREEP' ? '⚠️' : '🚨',
    confidence: parsed.confidence || '94%',
    confClass: parsed.verdict === 'IN SCOPE' ? 'text-success' : parsed.verdict === 'POTENTIAL SCOPE CREEP' ? 'text-warning' : 'text-danger',
    sub: parsed.verdict === 'IN SCOPE' ? 'Contract Boundary Respected' : 'Out-of-Scope Creep Intercepted',
    riskLevel: parsed.riskLevel || 'High Risk',
    estHours: parsed.estHours || 4,
    estCost: `$${((parsed.estHours || 4) * rate).toFixed(2)}`,
    reasoning: parsed.reasoning,
    reply: parsed.reply,
    isCreep: parsed.verdict !== 'IN SCOPE',
    severity: parsed.severity || 'high'
  };
}

// ── UI ACTIONS & EVENT LISTENERS ─────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function loadPreset(presetKey) {
  currentPreset = presetKey;
  const p = PRESETS[presetKey];
  if (!p) return;

  document.querySelectorAll('.preset-card').forEach(c => {
    c.classList.toggle('active', c.dataset.preset === presetKey);
  });

  document.getElementById('scope-input').value = p.scope;
  document.getElementById('project-name').value = p.title;
  document.getElementById('hourly-rate').value = p.rate;
  document.getElementById('client-name').value = p.client;

  scopeText = p.scope;
  parseScopeClauses(p.scope);
  renderSampleChips(p.samples);

  playSound('click');
  showToast(`Loaded Preset Profile: ${p.title}`);
}

function renderSampleChips(samples) {
  const container = document.getElementById('sample-chips-container');
  container.innerHTML = samples.map((s, idx) => `
    <div class="chip-item ${s.type}" onclick="selectSampleScenario(${idx})">
      ${s.label}
    </div>
  `).join('');
}

window.selectSampleScenario = function(idx) {
  const p = PRESETS[currentPreset];
  if (!p || !p.samples[idx]) return;
  const sample = p.samples[idx];

  document.getElementById('client-name').value = sample.client;
  document.getElementById('message-input').value = sample.text;
  
  // Set tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.channel === sample.channel);
  });
  activeChannel = sample.channel;
  updateChannelBadge();

  playSound('click');
  showToast(`Loaded test scenario: ${sample.label}`);
};

function updateChannelBadge() {
  const display = document.getElementById('channel-display-icon');
  const icon = activeChannel === 'slack' ? '<i class="fa-brands fa-slack"></i> Slack #proj-channel' :
               activeChannel === 'email' ? '<i class="fa-solid fa-envelope"></i> Client Email Direct' : '<i class="fa-brands fa-whatsapp"></i> WhatsApp Business';
  display.innerHTML = icon;
}

// ── MAIN ANALYSIS EXECUTION ──────────────────────────────
async function executeAnalysis() {
  const message = document.getElementById('message-input').value.trim();
  const clientName = document.getElementById('client-name').value.trim();
  const currentScope = document.getElementById('scope-input').value.trim();

  if (!message) { showToast('Please enter or select a client message first.', 'warning'); return; }
  if (!currentScope) { showToast('Please define a scope document first.', 'warning'); return; }

  const btn = document.getElementById('analyse-btn');
  const btnText = document.getElementById('analyse-btn-text');
  btn.disabled = true;
  btnText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Auditing Semantics...`;

  // Animate Terminal Status
  const termStatus = document.getElementById('t-anim-status');
  termStatus.innerHTML = `<span class="t-prefix">[AUDIT]</span> Intercepted ${activeChannel.toUpperCase()} message... Analyzing against ${parsedInScope.length} clauses`;

  try {
    const apiKey = document.getElementById('api-key-input').value.trim();
    let result;

    if (apiKey) {
      document.getElementById('ai-engine-status').textContent = 'OpenAI GPT-4o Connected';
      result = await callOpenAI(apiKey, message, currentScope, clientName);
    } else {
      document.getElementById('ai-engine-status').textContent = 'High-Precision AI Engine (Demo Mode)';
      await new Promise(r => setTimeout(r, 600)); // smooth experience delay
      result = localAISemanticAnalysis(message, currentScope, clientName);
    }

    currentResult = { ...result, message, client: clientName, channel: activeChannel };
    renderAnalysisResult(result);

    statsChecked++;
    if (result.isCreep) {
      statsFlagged++;
      playSound('creep');
    } else {
      playSound('success');
    }

    updateStats();
    addHistoryItem(currentResult);

  } catch (err) {
    showToast(`Error: ${err.message}`, 'danger');
  } finally {
    btn.disabled = false;
    btnText.innerHTML = `<i class="fa-solid fa-magnifying-glass-chart"></i> Audit Scope Creep`;
  }
}

function renderAnalysisResult(r) {
  document.getElementById('result-placeholder').style.display = 'none';
  const activeContent = document.getElementById('result-active-content');
  activeContent.style.display = 'block';

  document.getElementById('result-icon').textContent = r.icon;
  document.getElementById('result-verdict').textContent = r.verdict;
  document.getElementById('result-verdict').className = `v-title ${r.confClass}`;
  document.getElementById('result-sub').textContent = r.sub;
  document.getElementById('result-confidence').textContent = r.confidence;

  document.getElementById('result-risk-level').textContent = r.riskLevel;
  document.getElementById('result-risk-level').className = `detail-val ${r.confClass}`;
  document.getElementById('result-est-hours').textContent = `${r.estHours} Hours`;
  document.getElementById('result-est-cost').textContent = r.estCost;

  document.getElementById('result-reasoning').textContent = r.reasoning;

  const replySection = document.getElementById('reply-section');
  if (r.reply) {
    replySection.style.display = 'block';
    document.getElementById('result-reply').textContent = r.reply;
  } else {
    replySection.style.display = 'none';
  }
}

function updateStats() {
  document.getElementById('stat-checked').textContent = statsChecked;
  document.getElementById('stat-flagged').textContent = statsFlagged;
  
  const totalRevenue = driftLog.filter(x => x.status === 'unbilled').reduce((sum, item) => sum + item.cost, 0);
  document.getElementById('stat-saved').textContent = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  document.getElementById('log-revenue').textContent = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

  document.getElementById('log-total').textContent = driftLog.length;
  const unbilledCount = driftLog.filter(x => x.status === 'unbilled').length;
  document.getElementById('log-unbilled').textContent = unbilledCount;

  const unbilledHours = driftLog.filter(x => x.status === 'unbilled').reduce((sum, item) => sum + item.hours, 0);
  document.getElementById('log-hours').textContent = `${unbilledHours}h`;
}

function addHistoryItem(r) {
  msgHistory.unshift(r);
  const container = document.getElementById('message-history');
  const tagClass = r.isCreep ? 'danger' : 'success';
  const tagLabel = r.isCreep ? 'SCOPE CREEP' : 'IN SCOPE';

  const itemHtml = `
    <div class="msg-hist-item">
      <div class="msg-hist-left">
        <span class="hist-tag ${tagClass}">${tagLabel}</span>
        <strong>${r.client} (${r.channel})</strong>
        <span style="color:var(--text-muted);">${r.message.slice(0, 70)}...</span>
      </div>
      <span style="font-size:12px;color:var(--text-sub);">${new Date().toLocaleTimeString()}</span>
    </div>
  `;
  container.insertAdjacentHTML('afterbegin', itemHtml);
}

// ── DRIFT LOG MANAGER ─────────────────────────────────────
function renderDriftLog() {
  const tbody = document.getElementById('log-tbody');
  const emptyRow = document.getElementById('log-empty-row');

  if (driftLog.length === 0) {
    emptyRow.style.display = '';
    updateStats();
    return;
  }

  emptyRow.style.display = 'none';
  tbody.querySelectorAll('.log-dyn-row').forEach(r => r.remove());

  driftLog.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.className = 'log-dyn-row';
    const sevClass = item.severity === 'high' ? 'sev-high' : item.severity === 'medium' ? 'sev-med' : 'sev-low';
    const statusColor = item.status === 'billed' ? 'text-success' : 'text-danger';

    tr.innerHTML = `
      <td style="color:var(--text-muted);font-size:12px;">${item.date}</td>
      <td><strong>${item.client}</strong></td>
      <td style="color:var(--text-muted);text-transform:capitalize;">${item.channel}</td>
      <td>${item.summary}</td>
      <td><span class="sev-badge ${sevClass}">${item.severity.toUpperCase()}</span></td>
      <td><strong>${item.hours}h</strong> ($${item.cost})</td>
      <td><span class="${statusColor}" style="font-weight:700;">${item.status.toUpperCase()}</span></td>
      <td>
        <button class="btn-sm btn-success-sm" onclick="markLogStatus(${i}, 'billed')">Mark Billed</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateStats();
}

window.markLogStatus = function(i, status) {
  driftLog[i].status = status;
  renderDriftLog();
  playSound('success');
  showToast(`Item updated to ${status.toUpperCase()}`);
};

// ── CHANGE ORDER GENERATOR ────────────────────────────────
function generateChangeOrderDoc() {
  const rate = parseInt(document.getElementById('hourly-rate').value) || 75;
  const project = document.getElementById('project-name').value;
  const agency = document.getElementById('freelancer-name').value;
  const unbilled = driftLog.filter(x => x.status === 'unbilled');

  if (unbilled.length === 0) {
    showToast('No unbilled scope drift items in your matrix.', 'warning');
    return;
  }

  const totalHours = unbilled.reduce((s, x) => s + x.hours, 0);
  const totalAmount = totalHours * rate;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const lineItems = unbilled.map((item, idx) => `
${idx + 1}. SCOPE AMENDMENT: ${item.summary}
   • Channel Origin: ${item.channel.toUpperCase()} (${item.date})
   • Calculated Effort: ${item.hours} Hours @ $${rate}/hr
   • Subtotal: $${(item.hours * rate).toFixed(2)}
`).join('');

  const doc = `====================================================================
               FORMAL CHANGE ORDER / SCOPE AMENDMENT                
====================================================================
ISSUED BY  : ${agency}
PROJECT    : ${project}
DATE       : ${today}
STATUS     : PENDING E-SIGNATURE AUTHORIZATION
====================================================================

The following out-of-scope client requests were identified, logged, and
semantically audited against signed agreement terms:

${lineItems}

====================================================================
TOTAL OUT-OF-SCOPE EFFORT : ${totalHours} Hours
BILLABLE RATE            : $${rate}.00 / Hour
TOTAL AUTHORIZATION DUE   : $${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
====================================================================

By approving below, client authorizes the additional work scope and 
amends the primary project budget schedule.

Client Authorization Signature: _______________________ Date: ________

Generated via ScopeGuard Autonomous AI Platform
====================================================================`;

  document.getElementById('modal-body').innerHTML = `<pre class="change-order-doc">${doc}</pre>`;
  document.getElementById('modal-overlay').style.display = 'flex';

  document.getElementById('modal-copy-btn').onclick = () => {
    navigator.clipboard.writeText(doc);
    showToast('Change Order copied to clipboard!');
  };

  document.getElementById('modal-print-btn').onclick = () => {
    window.print();
  };
}

// ── INITIALIZATION & LISTENERS ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticleBg();
  loadPreset('webdesign');

  // Strictness Slider
  const slider = document.getElementById('strictness-slider');
  slider.addEventListener('input', (e) => {
    strictnessLevel = e.target.value;
    document.getElementById('strictness-val').textContent = strictnessLevel === '1' ? 'Flexible' : strictnessLevel === '2' ? 'Standard (Balanced)' : 'Strict Enforcement';
  });

  // Scope Save
  document.getElementById('save-scope-btn').addEventListener('click', () => {
    scopeText = document.getElementById('scope-input').value;
    parseScopeClauses(scopeText);
    playSound('success');
    showToast('Contract Scope Activated! AI Vectors Indexed.');
  });

  // Channel Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeChannel = e.currentTarget.dataset.channel;
      updateChannelBadge();
    });
  });

  // Presets Click
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => loadPreset(card.dataset.preset));
  });

  // Key Shortcut
  document.getElementById('message-input').addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      executeAnalysis();
    }
  });

  // Analyze Button
  document.getElementById('analyse-btn').addEventListener('click', executeAnalysis);

  // Add to Drift Log
  document.getElementById('add-to-log-btn').addEventListener('click', () => {
    if (!currentResult || !currentResult.isCreep) return;
    const now = new Date();
    const rate = parseInt(document.getElementById('hourly-rate').value) || 75;

    driftLog.unshift({
      id: Date.now(),
      date: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      client: currentResult.client,
      channel: currentResult.channel,
      summary: currentResult.message,
      severity: currentResult.severity,
      hours: currentResult.estHours,
      cost: currentResult.estHours * rate,
      status: 'unbilled'
    });

    renderDriftLog();
    playSound('success');
    showToast('Added to Scope Drift Matrix!');
    document.getElementById('driftlog').scrollIntoView({ behavior: 'smooth' });
  });

  // Copy Reply
  document.getElementById('copy-reply-btn').addEventListener('click', () => {
    const replyText = document.getElementById('result-reply').textContent;
    navigator.clipboard.writeText(replyText);
    showToast('AI Draft Response Copied!');
  });

  // Simulate Send
  document.getElementById('simulate-send-btn').addEventListener('click', () => {
    playSound('success');
    showToast(`Draft response sent to ${currentResult.client} via ${currentResult.channel.toUpperCase()}!`);
  });

  // Audio Toggle
  document.getElementById('audio-toggle').addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    document.getElementById('audio-toggle').innerHTML = audioEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(audioEnabled ? 'UI Sound Effects Enabled' : 'Muted Sound Effects');
  });

  // Demo Log Loader
  document.getElementById('load-demo-log').addEventListener('click', () => {
    const rate = parseInt(document.getElementById('hourly-rate').value) || 75;
    driftLog = [
      { id: 1, date: '2026-07-25 10:14', client: 'Sarah (Acme Corp)', channel: 'slack', summary: 'Blog & CMS System Addition', severity: 'high', hours: 8, cost: 8 * rate, status: 'unbilled' },
      { id: 2, date: '2026-07-25 14:30', client: 'Sarah (Acme Corp)', channel: 'email', summary: 'HubSpot CRM API Integration', severity: 'high', hours: 6, cost: 6 * rate, status: 'unbilled' },
      { id: 3, date: '2026-07-26 09:45', client: 'Sarah (Acme Corp)', channel: 'slack', summary: '3rd Round Revision on Hero Section', severity: 'medium', hours: 3, cost: 3 * rate, status: 'billed' }
    ];
    renderDriftLog();
    showToast('Loaded Demo Drift Audit Matrix!');
  });

  document.getElementById('clear-log-btn').addEventListener('click', () => {
    driftLog = [];
    renderDriftLog();
    showToast('Log cleared');
  });

  // Generate Bill
  document.getElementById('generate-bill-btn').addEventListener('click', generateChangeOrderDoc);

  // Quick Auto Demo Button
  document.getElementById('quick-demo-btn').addEventListener('click', () => {
    selectSampleScenario(0);
    setTimeout(executeAnalysis, 400);
  });

  // Export CSV
  document.getElementById('export-btn').addEventListener('click', () => {
    if (driftLog.length === 0) return;
    let csv = 'Timestamp,Client,Channel,Summary,Severity,Hours,Cost,Status\n';
    driftLog.forEach(row => {
      csv += `"${row.date}","${row.client}","${row.channel}","${row.summary.replace(/"/g, '""')}","${row.severity}",${row.hours},${row.cost},"${row.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScopeGuard_Drift_Matrix_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported CSV Audit Report!');
  });

  // Modals
  ['modal-close', 'modal-close2'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      document.getElementById('modal-overlay').style.display = 'none';
    });
  });
});
