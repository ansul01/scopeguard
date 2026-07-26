/* ── ScopeGuard MVP — app.js ─────────────────────────── */

// ── STATE ─────────────────────────────────────────────
let scope = '';
let driftLog = [];
let msgHistory = [];
let statsChecked = 0, statsFlagged = 0, statsSaved = 0;
let currentResult = null;

// ── SAMPLE DATA ───────────────────────────────────────
const SAMPLE_SCOPE = `Project: Website Redesign for Acme Corp
Client: Sarah (Acme Corp)
Duration: June 1 – July 31, 2026
Rate: $75/hour

DELIVERABLES (In Scope):
- 5-page responsive website: Home, About, Services, Portfolio, Contact
- 2 rounds of design revisions included
- SEO meta tags setup on all pages
- Basic contact form with email notification
- Mobile-responsive layout
- Deployment to client's existing hosting

OUT OF SCOPE (requires change order):
- E-commerce or payment processing
- Blog, CMS, or admin dashboard
- Ongoing maintenance after go-live
- Video production or animation
- Logo redesign or brand identity
- Social media management or content writing
- More than 2 revision rounds
- Additional pages beyond the 5 agreed
- Third-party integrations (CRM, booking systems, etc.)`;

const SAMPLE_MESSAGES = [
  {
    label: '🔴 Out of Scope', cls: 'sample-out-scope', client: 'Sarah (Acme Corp)', channel: 'slack',
    text: 'Hey! The site is looking great. Can you also add a small blog section? Nothing fancy, just a place where I can post updates. Shouldn\'t take long right?'
  },
  {
    label: '🔴 Out of Scope', cls: 'sample-out-scope', client: 'Sarah (Acme Corp)', channel: 'email',
    text: 'Hi, one more thing — could you integrate our HubSpot CRM into the contact form so leads go directly into our pipeline? Also can you redesign the logo while you\'re at it?'
  },
  {
    label: '🟡 Borderline', cls: 'sample-out-scope', client: 'Sarah (Acme Corp)', channel: 'slack',
    text: 'The About page looks good! But I was thinking, could we do a third round of revisions on the homepage? I want to show it to my partner and they might have notes too.'
  },
  {
    label: '🟢 In Scope', cls: 'sample-in-scope', client: 'Sarah (Acme Corp)', channel: 'slack',
    text: 'Can you tweak the font size on the Services page headings and make the CTA button on the homepage a brighter blue? This is part of our second revision.'
  },
  {
    label: '🟢 In Scope', cls: 'sample-in-scope', client: 'Sarah (Acme Corp)', channel: 'email',
    text: 'Hi! Can you update the meta description on the Contact page? The current one is too generic for SEO.'
  },
];

// ── DEMO LOG DATA ─────────────────────────────────────
const DEMO_LOG = [
  {
    id: 1, date: '2026-07-22 09:14', client: 'Sarah (Acme Corp)', channel: 'Slack',
    summary: 'Add a blog/CMS section to the website', severity: 'high', hours: 8, status: 'unbilled'
  },
  {
    id: 2, date: '2026-07-23 14:32', client: 'Sarah (Acme Corp)', channel: 'Email',
    summary: 'Integrate HubSpot CRM into contact form', severity: 'high', hours: 6, status: 'unbilled'
  },
  {
    id: 3, date: '2026-07-24 11:05', client: 'Sarah (Acme Corp)', channel: 'Slack',
    summary: 'Third round of homepage revisions (beyond 2 agreed)', severity: 'medium', hours: 3, status: 'billed'
  },
  {
    id: 4, date: '2026-07-25 16:48', client: 'Sarah (Acme Corp)', channel: 'Email',
    summary: 'Logo redesign request', severity: 'high', hours: 5, status: 'unbilled'
  },
];

// ── DEMO MODE RESPONSES ───────────────────────────────
function demoAnalyse(message) {
  const m = message.toLowerCase();
  const outKeywords = ['blog', 'cms', 'crm', 'hubspot', 'logo', 'e-commerce', 'payment', 'animation',
    'social media', 'maintenance', 'booking', 'admin', 'dashboard', 'integration', 'extra page',
    'additional page', 'redesign the logo', 'third round', '3rd round', 'video'];
  const partialKeywords = ['another revision', 'third revision', 'one more round', 'extra revision'];

  const isOut = outKeywords.some(k => m.includes(k));
  const isPartial = !isOut && partialKeywords.some(k => m.includes(k));

  if (isOut) {
    const item = outKeywords.find(k => m.includes(k));
    return {
      verdict: 'OUT OF SCOPE',
      icon: '🚨',
      confidence: '94%',
      confClass: 'color:#ef4444',
      sub: 'This request falls outside your signed agreement.',
      reasoning: `The client's message requests "${item}" which is explicitly listed as out of scope in your agreement. Semantic analysis confirms this is a new deliverable not covered by the original contract.`,
      reply: `Hi Sarah,\n\nThank you for the feedback — glad you're happy with the progress!\n\nI noticed this request falls outside our original scope of work. I'd be happy to take this on as an addition, but it would require a change order.\n\nEstimated additional cost: ${Math.floor(Math.random() * 3 + 4)} hours × $75/hr = $${(Math.floor(Math.random() * 3 + 4) * 75).toLocaleString()}\n\nWould you like me to send over a formal change order to get this started?\n\nBest,\nAlex`,
      isCreep: true,
      severity: 'high',
      estHours: Math.floor(Math.random() * 4) + 4
    };
  } else if (isPartial) {
    return {
      verdict: 'POTENTIAL SCOPE CREEP',
      icon: '⚠️',
      confidence: '71%',
      confClass: 'color:#f59e0b',
      sub: 'This may exceed the agreed revision limit.',
      reasoning: 'Your scope includes 2 rounds of design revisions. This request appears to be asking for an additional round beyond what was agreed. Please verify how many rounds have already been used.',
      reply: `Hi Sarah,\n\nThanks for your notes! Just to check — we've already used both included revision rounds. Any further revisions would be billed at $75/hr.\n\nShall I proceed and add this to a change order?\n\nBest,\nAlex`,
      isCreep: true,
      severity: 'medium',
      estHours: 2
    };
  } else {
    return {
      verdict: 'IN SCOPE ✓',
      icon: '✅',
      confidence: '97%',
      confClass: 'color:#10b981',
      sub: 'This request is covered by your signed agreement.',
      reasoning: 'This request aligns with the deliverables defined in your scope of work. No additional billing is required — proceed as normal.',
      reply: null,
      isCreep: false,
      severity: null,
      estHours: 0
    };
  }
}

// ── OPENAI API CALL ─────────────────────────────────────
async function callClaude(apiKey, message, scopeDoc) {
  const prompt = `You are ScopeGuard, an AI that helps freelancers detect scope creep.

SIGNED SCOPE DOCUMENT:
${scopeDoc}

CLIENT MESSAGE:
"${message}"

Analyse if this message is IN SCOPE or OUT OF SCOPE based on the signed agreement.

Respond ONLY with valid JSON in this exact format:
{
  "verdict": "OUT OF SCOPE" | "IN SCOPE" | "POTENTIAL SCOPE CREEP",
  "confidence": "number as string with % e.g. 87%",
  "reasoning": "2-3 sentence explanation",
  "severity": "high" | "medium" | "low" | null,
  "estHours": number,
  "replyDraft": "polite professional reply to the client (null if in scope)"
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
        { role: 'system', content: 'You are ScopeGuard, a scope creep detection AI. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ── UI HELPERS ────────────────────────────────────────
function toast(msg, duration = 3000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

function updateStats() {
  animateNum('stat-checked', statsChecked);
  animateNum('stat-flagged', statsFlagged);
  document.getElementById('stat-saved').textContent = '$' + statsSaved.toLocaleString();
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  let cur = parseInt(el.textContent) || 0;
  if (cur === target) return;
  const step = Math.ceil(Math.abs(target - cur) / 12);
  const t = setInterval(() => {
    cur = cur < target ? Math.min(cur + step, target) : Math.max(cur - step, target);
    el.textContent = cur;
    if (cur === target) clearInterval(t);
  }, 40);
}

// ── DRIFT LOG ─────────────────────────────────────────
function renderLog() {
  const tbody = document.getElementById('log-tbody');
  const emptyRow = document.getElementById('log-empty-row');

  if (driftLog.length === 0) {
    emptyRow.style.display = '';
    updateLogStats();
    return;
  }
  emptyRow.style.display = 'none';

  // Remove existing dynamic rows
  tbody.querySelectorAll('.log-dyn-row').forEach(r => r.remove());

  driftLog.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.className = 'log-dyn-row';
    const sevClass = { high: 'sev-high', medium: 'sev-medium', low: 'sev-low' }[item.severity] || 'sev-medium';
    const stClass = item.status === 'billed' ? 'status-billed' : item.status === 'waived' ? 'status-waived' : 'status-unbilled';
    tr.innerHTML = `
      <td style="color:var(--muted);font-size:12px;white-space:nowrap">${item.date}</td>
      <td style="font-weight:600">${item.client}</td>
      <td style="color:var(--muted)">${item.channel}</td>
      <td>${item.summary}</td>
      <td><span class="severity-badge ${sevClass}">${item.severity.toUpperCase()}</span></td>
      <td style="text-align:center;font-weight:600">${item.hours}h</td>
      <td><span class="status-badge ${stClass}">${item.status}</span></td>
      <td>
        <button class="log-action-btn" onclick="markStatus(${i},'billed')">Bill</button>
        <button class="log-action-btn" onclick="markStatus(${i},'waived')" style="margin-left:4px">Waive</button>
      </td>`;
    tbody.appendChild(tr);
  });
  updateLogStats();
}

window.markStatus = function (i, status) {
  driftLog[i].status = status;
  renderLog();
  toast(`Marked as ${status}`);
};

function updateLogStats() {
  const total = driftLog.length;
  const unbilled = driftLog.filter(x => x.status === 'unbilled').length;
  const hours = driftLog.filter(x => x.status === 'unbilled').reduce((s, x) => s + x.hours, 0);
  const revenue = hours * (parseInt(document.getElementById('hourly-rate')?.value) || 75);
  document.getElementById('log-total').textContent = total;
  document.getElementById('log-unbilled').textContent = unbilled;
  document.getElementById('log-hours').textContent = hours + 'h';
  document.getElementById('log-revenue').textContent = '$' + revenue.toLocaleString();
  statsSaved = revenue;
  document.getElementById('stat-saved').textContent = '$' + statsSaved.toLocaleString();
}

// ── TERMINAL ANIMATION ────────────────────────────────
const termLines = [
  { id: 't-anim-1', cls: 't-warn', msgs: ['⏳ Analysing message…', '⏳ Checking against scope…'] },
  { id: 't-anim-2', cls: 't-flag', msgs: ['🚨 SCOPE CREEP DETECTED', '✅ Message in scope'] },
  { id: 't-anim-3', cls: 't-ok', msgs: ['📝 Draft reply generated', '🟢 No action needed'] },
];
let termIdx = 0;
setInterval(() => {
  termLines.forEach((l, i) => {
    const el = document.getElementById(l.id);
    if (el) el.textContent = l.msgs[termIdx % l.msgs.length];
  });
  termIdx++;
}, 2200);

// ── WORD COUNT ────────────────────────────────────────
document.getElementById('scope-input').addEventListener('input', function () {
  const words = this.value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('scope-word-count').textContent = words + ' words';
});

// ── SCOPE SAVE ────────────────────────────────────────
document.getElementById('save-scope-btn').addEventListener('click', () => {
  const val = document.getElementById('scope-input').value.trim();
  if (!val) { toast('⚠️ Please paste your scope document first.'); return; }
  scope = val;
  document.getElementById('scope-saved-banner').style.display = 'flex';
  toast('✅ Scope activated!');
});

document.getElementById('load-sample-scope').addEventListener('click', () => {
  document.getElementById('scope-input').value = SAMPLE_SCOPE;
  document.getElementById('scope-input').dispatchEvent(new Event('input'));
});

document.getElementById('clear-scope').addEventListener('click', () => {
  document.getElementById('scope-input').value = '';
  document.getElementById('scope-word-count').textContent = '0 words';
  scope = '';
  document.getElementById('scope-saved-banner').style.display = 'none';
});

// ── SAMPLE MESSAGES ───────────────────────────────────
document.getElementById('load-sample-messages-btn').addEventListener('click', () => {
  const panel = document.getElementById('samples-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  if (panel.style.display === 'block' && !document.getElementById('sample-msgs-list').children.length) {
    const list = document.getElementById('sample-msgs-list');
    SAMPLE_MESSAGES.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'sample-msg-item';
      div.innerHTML = `<div class="sample-msg-label ${s.cls}">${s.label}</div><div>${s.text}</div>`;
      div.onclick = () => {
        document.getElementById('client-name').value = s.client;
        document.getElementById('channel-select').value = s.channel;
        document.getElementById('message-input').value = s.text;
        panel.style.display = 'none';
      };
      list.appendChild(div);
    });
  }
});

// ── ANALYSE MESSAGE ───────────────────────────────────
document.getElementById('analyse-btn').addEventListener('click', async () => {
  const message = document.getElementById('message-input').value.trim();
  if (!message) { toast('⚠️ Please enter a client message.'); return; }
  if (!scope) { toast('⚠️ Please save a scope document first (Step 1).'); return; }

  const btn = document.getElementById('analyse-btn');
  const btnText = document.getElementById('analyse-btn-text');
  btn.disabled = true;
  btnText.innerHTML = '<span class="spinner"></span> Analysing…';

  try {
    const apiKey = document.getElementById('api-key-input').value.trim();
    let result;
    if (apiKey) {
      const raw = await callClaude(apiKey, message, scope);
      result = {
        verdict: raw.verdict,
        icon: raw.verdict === 'IN SCOPE' ? '✅' : raw.verdict === 'POTENTIAL SCOPE CREEP' ? '⚠️' : '🚨',
        confidence: raw.confidence,
        confClass: raw.verdict === 'IN SCOPE' ? 'color:#10b981' : raw.verdict === 'POTENTIAL SCOPE CREEP' ? 'color:#f59e0b' : 'color:#ef4444',
        sub: raw.verdict === 'IN SCOPE' ? 'Covered by your signed agreement.' : 'Falls outside your signed agreement.',
        reasoning: raw.reasoning,
        reply: raw.replyDraft || null,
        isCreep: raw.verdict !== 'IN SCOPE',
        severity: raw.severity,
        estHours: raw.estHours || 0
      };
    } else {
      result = demoAnalyse(message);
    }

    currentResult = { ...result, message, client: document.getElementById('client-name').value, channel: document.getElementById('channel-select').value };
    showResult(result);

    // Update stats & history
    statsChecked++;
    if (result.isCreep) statsFlagged++;
    updateStats();
    addToHistory(currentResult);

  } catch (e) {
    toast('❌ Error: ' + e.message);
    console.error(e);
  } finally {
    btn.disabled = false;
    btnText.textContent = '🔍 Analyse Message';
  }
});

function showResult(r) {
  const card = document.getElementById('result-card');
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  document.getElementById('result-icon').textContent = r.icon;
  document.getElementById('result-verdict').textContent = r.verdict;
  document.getElementById('result-sub').textContent = r.sub;
  document.getElementById('result-confidence').textContent = r.confidence;
  document.getElementById('result-confidence').style.cssText = r.confClass + ';background:var(--bg3);border-radius:8px;padding:6px 14px;font-size:20px;font-weight:800;margin-left:auto';
  document.getElementById('result-reasoning').textContent = r.reasoning;

  const replySection = document.getElementById('reply-section');
  if (r.reply) {
    replySection.style.display = 'block';
    document.getElementById('result-reply').textContent = r.reply;
  } else {
    replySection.style.display = 'none';
  }
  card.style.animation = 'none';
  requestAnimationFrame(() => { card.style.animation = 'fade-in .35s ease'; });
}

function addToHistory(r) {
  msgHistory.unshift(r);
  const container = document.getElementById('message-history');
  const div = document.createElement('div');
  div.className = 'msg-history-item';
  const badgeCls = r.isCreep ? (r.severity === 'medium' ? 'partial' : 'flag') : 'ok';
  const badgeLabel = r.isCreep ? (r.severity === 'medium' ? 'PARTIAL' : 'CREEP') : 'OK';
  div.innerHTML = `
    <span class="msg-hist-badge ${badgeCls}">${badgeLabel}</span>
    <span class="msg-hist-client">${r.client}</span>
    <span class="msg-hist-text">${r.message}</span>
    <span class="msg-hist-time">${new Date().toLocaleTimeString()}</span>`;
  container.prepend(div);
}

// ── COPY REPLY ────────────────────────────────────────
document.getElementById('copy-reply-btn').addEventListener('click', () => {
  const text = document.getElementById('result-reply').textContent;
  navigator.clipboard.writeText(text).then(() => toast('📋 Reply copied to clipboard!'));
});

// ── ADD TO LOG ────────────────────────────────────────
document.getElementById('add-to-log-btn').addEventListener('click', () => {
  if (!currentResult || !currentResult.isCreep) { toast('⚠️ Only out-of-scope items can be added.'); return; }
  const now = new Date();
  const date = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
  driftLog.unshift({
    id: Date.now(), date, client: currentResult.client, channel: currentResult.channel,
    summary: currentResult.message.slice(0, 80) + (currentResult.message.length > 80 ? '…' : ''),
    severity: currentResult.severity || 'medium',
    hours: currentResult.estHours || 2, status: 'unbilled'
  });
  renderLog();
  toast('✅ Added to Drift Log!');
  document.getElementById('driftlog').scrollIntoView({ behavior: 'smooth' });
});

// ── DEMO LOG ──────────────────────────────────────────
document.getElementById('load-demo-log').addEventListener('click', () => {
  driftLog = [...DEMO_LOG];
  renderLog();
  statsFlagged = driftLog.length;
  statsChecked = Math.max(statsChecked, driftLog.length + 6);
  updateStats();
  toast('📊 Demo data loaded!');
});

document.getElementById('clear-log-btn').addEventListener('click', () => {
  driftLog = [];
  renderLog();
  toast('🗑️ Log cleared.');
});

// ── EXPORT ────────────────────────────────────────────
document.getElementById('export-btn').addEventListener('click', () => {
  if (!driftLog.length) { toast('⚠️ No items to export.'); return; }
  let csv = 'Date,Client,Channel,Summary,Severity,Hours,Status\n';
  driftLog.forEach(r => { csv += `"${r.date}","${r.client}","${r.channel}","${r.summary}","${r.severity}",${r.hours},"${r.status}"\n`; });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ScopeGuard_DriftLog.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('📤 Exported to CSV!');
});

// ── BILLING ───────────────────────────────────────────
document.getElementById('generate-bill-btn').addEventListener('click', () => {
  const rate = parseInt(document.getElementById('hourly-rate').value) || 75;
  const project = document.getElementById('project-name').value;
  const name = document.getElementById('freelancer-name').value;
  const unbilled = driftLog.filter(x => x.status === 'unbilled');
  if (!unbilled.length) { toast('⚠️ No unbilled items in the drift log.'); return; }

  const totalHours = unbilled.reduce((s, x) => s + x.hours, 0);
  const totalCost = totalHours * rate;
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  let lines = unbilled.map((x, i) => `  ${i + 1}. ${x.summary}\n     Source: ${x.channel} — ${x.date}\n     Estimated: ${x.hours}h × $${rate} = $${(x.hours * rate).toLocaleString()}`).join('\n\n');

  const doc = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE ORDER / SCOPE AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issued by : ${name}
Project   : ${project}
Date      : ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following requests were received outside the
original signed scope of work:

${lines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ADDITIONAL HOURS : ${totalHours}h
HOURLY RATE            : $${rate}/hr
TOTAL AMOUNT DUE       : $${totalCost.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please review and approve this change order to
authorise the additional work and billing.

Approved by: _____________________ Date: ________

Generated by ScopeGuard · AI First Hackathon 2026`;

  document.getElementById('modal-body').innerHTML = `<div class="change-order-preview">${doc}</div>`;
  document.getElementById('modal-overlay').style.display = 'flex';

  document.getElementById('modal-copy-btn').onclick = () => {
    navigator.clipboard.writeText(doc).then(() => toast('📋 Change order copied!'));
  };
});

['modal-close', 'modal-close2'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    document.getElementById('modal-overlay').style.display = 'none';
  });
});
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay'))
    document.getElementById('modal-overlay').style.display = 'none';
});

// ── INIT ──────────────────────────────────────────────
renderLog();
updateStats();

// Auto-load sample scope so the app is ready to use
document.getElementById('scope-input').value = SAMPLE_SCOPE;
document.getElementById('scope-input').dispatchEvent(new Event('input'));
scope = SAMPLE_SCOPE;
document.getElementById('scope-saved-banner').style.display = 'flex';
