/* =============================================
   app.js — Theme toggle, Timeline, Carousel, Modal
   ============================================= */

/* ---- Theme Toggle ---- */
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  let theme  = localStorage.getItem('portfolio-theme') || 'dark';

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (btn) btn.innerHTML = t === 'dark' ? '&#9728;' : '&#9790;';
    localStorage.setItem('portfolio-theme', t);
  }

  applyTheme(theme);
  if (btn) {
    btn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
    });
  }
})();

/* ---- Job Data (Experience Timeline) ---- */
var JOBS = [
  {
    role:    'Senior PM – Digital Transformation',
    company: 'JindalX',
    period:  'Jun 2022 – May 2025',
    location:'New Delhi · 3 years',
    summary: 'Led comprehensive digital transformation strategy for 30+ enterprise-level projects. Managed portfolio of 7+ B2B SaaS solutions serving 16 enterprise clients with 5,000+ active users.',
    achievements: [
      'Delivered 25–40% operational efficiency improvements through autonomous automation deployment',
      'Reduced human intervention by 60% across HR, Operations, Finance, and IT workflows',
      'Transitioned 80% of repetitive tasks to autonomous automation, enabling strategic focus',
      'Pioneered Generative AI integration in enterprise workflows, improving decision-making speed by 45%'
    ]
  },
  {
    role:    'Product Manager',
    company: 'OneValley',
    period:  'Sep 2020 – Jul 2022',
    location:'Gurugram · 1 year 10 months',
    summary: 'Owned comprehensive product strategy for B2C entrepreneurship platform (Passport) and B2B enterprise solution (PassportOS), aligned with global startup initiatives including Entrepreneurship World Cup.',
    achievements: [
      'Conducted in-depth user research and roadmap planning to enhance product-market fit',
      'Implemented systematic KPI tracking and feature iteration processes using data-driven decision making',
      'Implemented B2B solutions for educational institutions, banks, accelerators, and corporate incubators across India and international markets',
      'Integrated mentorship frameworks, SaaS tool ecosystems, and comprehensive learning content management'
    ]
  },
  {
    role:    'Co-Founder & COO',
    company: 'Taccomacco Edutainment Pvt. Ltd.',
    period:  'Jul 2017 – Sep 2020',
    location:'Gurugram · 3 years 2 months',
    summary: 'Led product development and technical operations for a comprehensive digital content platform from concept to launch.',
    achievements: [
      'Successfully launched 500+ digital titles across multiple content categories',
      'Developed content pipeline management, version control, and digital publishing workflows',
      'Led product roadmap development and pricing strategy formulation',
      'Mentored 6+ creators through structured incubation program to scale original content production'
    ]
  },
  {
    role:    'Design Manager',
    company: 'RSP Design Consultants',
    period:  'Sep 2014 – Jun 2017',
    location:'Gurugram · 2 years 9 months',
    summary: 'Managed 40+ architectural and design projects across IT, healthcare, and institutional sectors with cross-disciplinary teams.',
    achievements: [
      'Maintained 95% client retention rate through optimized collaboration and project planning',
      'Reduced delivery time by 25% through project management best practices',
      'Coordinated architects, engineers, and project coordinators across complex multi-stakeholder projects'
    ]
  }
];

/* ---- Timeline ---- */
(function () {
  var items = document.querySelectorAll('.vtl-item');
  if (!items.length) return;

  /* Pre-render all job content into each item's body */
  items.forEach(function (item) {
    var idx  = parseInt(item.getAttribute('data-job'), 10);
    var j    = JOBS[idx];
    var body = item.querySelector('.vtl-body');
    if (!j || !body) return;
    body.innerHTML =
      '<p class="vtl-summary">' + j.summary + '</p>' +
      '<ul class="vtl-achievements">' +
      j.achievements.map(function (a) { return '<li>' + a + '</li>'; }).join('') +
      '</ul>';
  });

  function activate(jobIdx) {
    items.forEach(function (item) { item.classList.remove('is-active'); });
    var target = document.querySelector('.vtl-item[data-job="' + jobIdx + '"]');
    if (target) target.classList.add('is-active');
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      activate(parseInt(this.getAttribute('data-job'), 10));
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(parseInt(this.getAttribute('data-job'), 10));
      }
    });
  });

  activate(0); // JindalX open by default
})();

/* ---- Featured Projects Data ---- */
var PROJ_DATA = [
  {
    tag:     'AI · HR Tech',
    title:   'AI-Powered Talent Management Suite',
    role:    'Senior PM @ JindalX',
    metrics: ['50% faster hiring', '40% internal mobility↑', '200+ hiring managers'],
    desc:    'Built a comprehensive ATS from scratch with embedded AI workflows. Designed and shipped GenAI-driven job matching, automated candidate screening, and an internal mobility engine that surfaced hidden talent.',
    impact:  ['Reduced time-to-hire by 50% for 200+ hiring managers across 16 enterprise clients', 'Increased internal mobility by 40% through skill-gap analysis and AI-powered recommendations', 'Eliminated manual screening for 80% of inbound applications']
  },
  {
    tag:     'AI · Performance',
    title:   'Performance Management Platform (Xcellence)',
    role:    'Senior PM @ JindalX',
    metrics: ['60% less manual review', '25% engagement↑', '15 FTEs saved'],
    desc:    'End-to-end performance evaluation system for 5,000+ employees across 16 enterprise clients. AI-driven recommendation engine generated personalized development plans and automated the appraisal cycle.',
    impact:  ['Saved the equivalent of 15 FTEs by automating appraisal workflows', 'Reduced manual review effort by 60% for HR teams', 'Improved employee engagement scores by 25% within two quarters of launch']
  },
  {
    tag:     'EdTech · AI',
    title:   'Knowledge & Learning Platform (Insight)',
    role:    'Senior PM @ JindalX',
    metrics: ['45% performance↑', '35% training time↓', '60% faster resolution'],
    desc:    'AI-powered learning management system built for BPO agents. Integrated an intelligent chatbot for instant query resolution and built adaptive learning pathways that adjusted to each agent\'s performance data.',
    impact:  ['Improved agent performance scores by 45% over the first cohort', 'Cut training time by 35% through personalised pathways vs. one-size-fits-all modules', 'Reduced average query resolution time by 60% via the embedded chatbot']
  },
  {
    tag:     'B2B · CRM',
    title:   'B2B CRM & Auction Platform (AuctionIT)',
    role:    'Senior PM @ JindalX',
    metrics: ['30% transactions↑', 'Auto-invoicing', 'CRM integration'],
    desc:    'Comprehensive B2B CRM with tightly integrated auction management, automated bidding workflows, and real-time inventory tracking. Built for industrial procurement teams managing high-volume reverse auctions.',
    impact:  ['Increased transaction volume by 30% through UX optimisation and faster bid cycles', 'Eliminated manual invoice generation entirely through automated billing workflows', 'Reduced bid processing time by 40% via real-time auction engine integration']
  },
  {
    tag:     'HRMS · Automation',
    title:   'HR Management System (Touchpoint HRMS)',
    role:    'Senior PM @ JindalX',
    metrics: ['5,000+ agents', '25% satisfaction↑', 'Full ERP integration'],
    desc:    'Full-stack HRMS built for 5,000+ floating BPO agents. Covered payroll automation, leave management, compliance reporting, and attendance tracking with deep ERP and RESTful API integration across client systems.',
    impact:  ['Automated payroll and compliance reporting for 5,000+ agents across multiple shifts', 'Increased employee satisfaction scores by 25% through self-service features', 'Achieved seamless bi-directional sync with 3 enterprise ERP systems']
  },
  {
    tag:     'Analytics · BI',
    title:   'Business Intelligence Platform (Jx Data Cloud)',
    role:    'Senior PM @ JindalX',
    metrics: ['40% accuracy↑', '35% processing↓', 'Multi-source ETL'],
    desc:    'Centralised data warehouse consolidating operational data from HR, finance, and operations into real-time Power BI and Looker Studio dashboards. Automated ETL pipelines replaced manual weekly reporting.',
    impact:  ['Improved reporting accuracy by 40% by eliminating manual data reconciliation', 'Reduced data processing time by 35% through automated ETL pipeline design', 'Gave leadership real-time visibility across 16 enterprise clients in a single dashboard']
  }
];

/* ---- Case Study Data ---- */
var CS_DATA = [
  {
    tag:      'B2B SaaS · AI · Telegram Bot',
    label:    'Case Study 01',
    title:    'Founder\'s CRM — Conversation-First Sales Tool',
    metrics:  ['39-page PRD', '16 tools analysed', '10 founder interviews'],
    problem:  '60–70% of early-stage founders abandon CRM tools within 4 weeks. Every existing CRM requires the one behaviour they won\'t sustain — manually logging conversations after a call.',
    approach: '10 founder interviews, 85+ secondary sources, 16-tool competitor analysis. Designed a Telegram bot that treats conversation as the record itself — WhatsApp forwards, voice notes, and screenshots become structured deal data automatically.',
    outcome:  ['Full 39-page PRD covering 16 competitive tools and 10 primary interviews', 'Telegram-native architecture that requires zero behaviour change from founders', 'AI extraction layer turning unstructured conversation into CRM fields with no form-filling'],
    url:      'case-study-founder-crm.html',
    protoUrl: null
  },
  {
    tag:      'Quick Commerce · Operations · Real-Time',
    label:    'Case Study 02',
    title:    'Peak-Hour Decision Support for Blinkit Dark Stores',
    metrics:  ['Working prototype', '3 research methods', 'Unit economics modelled'],
    problem:  'Dark store managers have no real-time picker visibility during the 6–10 PM peak window. They discover issues 3–7 minutes too late — after orders have already breached SLA.',
    approach: 'Field observations at dark stores, interviews with ops professionals, competitor teardown (Instamart). Built a mobile-first command hub with live order cards, colour-coded risk triage, a nudge system, and structured shift handoff.',
    outcome:  ['Working Figma prototype with full interaction design', 'Unit economics model showing breakeven at 4+ SLA saves per shift', 'Structured shift handoff template adopted as part of the PRD recommendation'],
    url:      'case-study-blinkit.html',
    protoUrl: 'https://blinkit-command-hub.vercel.app/'
  },
  {
    tag:      'Consumer Platform · Algorithm · Mobile-First',
    label:    'Case Study 03',
    title:    'YouTube 2.0 — Fixing Long-Form Discovery',
    metrics:  ['171 survey responses', '4 product solutions', '27+ sources'],
    problem:  'Long-form engagement on YouTube is declining — not because users don\'t want long videos, but because the home feed stops surfacing them. 47% of users manually search every session; 29% of Gen Z sessions end without watching anything.',
    approach: '171-person primary survey, secondary research across 27+ sources, competitor graveyard analysis. Designed four native-feed solutions: Deep Dive Tab, Shorts-to-Long Bridge, Viewing Streak, and Creator Success Suite.',
    outcome:  ['Four fully-specced product features ready for A/B testing', 'Quantified problem: 47% search-every-session, 29% zero-watch Gen Z sessions', 'Roadmap prioritised by reach, confidence, and effort scoring'],
    url:      'case-study-youtube.html',
    protoUrl: null
  },
  {
    tag:      'Consumer App · AI · Group Coordination',
    label:    'Case Study 04',
    title:    'Group Travel Planning Platform',
    metrics:  ['6 user interviews', '$168.7B market', 'Full PRD'],
    problem:  'Group travel is a $168.7B market with no unified coordination layer. 1–2 people absorb 80%+ of all planning load. Silent budget and dietary misalignments surface mid-trip as conflict, not pre-trip as planning input.',
    approach: '6 primary user interviews, 12+ secondary sources, competitive analysis of 8 tools. Designed an AI-native coordination platform with anonymous preference polling, task distribution across group members, and a single shared dashboard.',
    outcome:  ['Full PRD with 5-phase implementation plan', 'Anonymous preference polling mechanism that eliminates social pressure during planning', 'MVP scoped to P0 features with clear success metrics: 60% survey completion, NPS > 40'],
    url:      'case-study-group-travel.html',
    protoUrl: null
  },
  {
    tag:      'Health Tech · AI · PWA · Buildathon',
    label:    'Case Study 05',
    title:    'Vitae — Health Records, Finally Understood',
    metrics:  ['Live product', '6-person team', 'Shipped in 10 days'],
    problem:  'Indian families manage parents\' health via blurry WhatsApp prescription photos. No structured records, impenetrable medical jargon, zero continuity across 3+ specialists. ₹6,000+ crore lost annually to repeat diagnostic tests from missing records.',
    approach: 'Rethink Health Buildathon (April 2026). Built an AI-powered PWA using Gemma 4 26B OCR + Claude for plain-language medication explanations. No signup needed to try. Family hub manages multiple profiles under one account.',
    outcome:  ['Live product at vitae-health.vercel.app', 'Two-pipeline AI architecture: Gemma 4 26B for OCR extraction + Claude for explanation', 'PWA installable on mobile with offline-first record access'],
    url:      'case-study-vitae.html',
    protoUrl: 'https://vitae-health.vercel.app/'
  }
];

/* ---- Carousel Factory ---- */
function initCarousel(trackId, prevId, nextId, dotsId, cardsPerView) {
  var track   = document.getElementById(trackId);
  var prevBtn = document.getElementById(prevId);
  var nextBtn = document.getElementById(nextId);
  var dotsEl  = document.getElementById(dotsId);

  if (!track || !prevBtn || !nextBtn || !dotsEl) return;

  var cards   = track.querySelectorAll('.carousel-card');
  var total   = cards.length;
  var perView = window.innerWidth <= 768 ? 1 : (cardsPerView || 2);
  var maxIdx  = Math.max(0, total - perView);
  var current = 0;

  function getCardWidth() {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + 20; // card width + gap
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    var pageCount = maxIdx + 1;
    for (var i = 0; i <= maxIdx; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('data-dot', i);
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === current);
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx));
    track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === maxIdx;
    updateDots();
  }

  buildDots();
  goTo(0);

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  dotsEl.addEventListener('click', function (e) {
    var dot = e.target.closest('.carousel-dot');
    if (dot) goTo(parseInt(dot.getAttribute('data-dot'), 10));
  });

  window.addEventListener('resize', function () {
    var newPer = window.innerWidth <= 768 ? 1 : (cardsPerView || 2);
    if (newPer !== perView) {
      perView = newPer;
      maxIdx  = Math.max(0, total - perView);
      buildDots();
      goTo(Math.min(current, maxIdx));
    }
  });
}

initCarousel('proj-track', 'proj-prev', 'proj-next', 'proj-dots', 2);
initCarousel('cs-track',   'cs-prev',   'cs-next',   'cs-dots',   2);

/* ---- Modal ---- */
(function () {
  var overlay  = document.getElementById('modal-overlay');
  var closeBtn = document.getElementById('modal-close');
  var body     = document.getElementById('modal-body');

  if (!overlay || !closeBtn || !body) return;

  function openModal(html) {
    body.innerHTML = html;
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function buildProjectModal(data) {
    var metrics = data.metrics.map(function (m) {
      return '<span class="modal-metric">' + m + '</span>';
    }).join('');
    var impact = data.impact.map(function (i) {
      return '<li>' + i + '</li>';
    }).join('');
    return (
      '<span class="modal-tag">' + data.tag + '</span>' +
      '<h2 class="modal-title" id="modal-title-el">' + data.title + '</h2>' +
      '<p class="modal-subtitle">' + data.role + '</p>' +
      '<div class="modal-metrics">' + metrics + '</div>' +
      '<div class="modal-divider"></div>' +
      '<p class="modal-section-label">Overview</p>' +
      '<p class="modal-text">' + data.desc + '</p>' +
      '<p class="modal-section-label">Impact</p>' +
      '<ul class="modal-list">' + impact + '</ul>'
    );
  }

  function buildCsModal(data) {
    var metrics = data.metrics.map(function (m) {
      return '<span class="modal-metric">' + m + '</span>';
    }).join('');
    var outcome = data.outcome.map(function (o) {
      return '<li>' + o + '</li>';
    }).join('');
    var ctas = '<a href="' + data.url + '" class="modal-cta">Read full case study &rarr;</a>';
    if (data.protoUrl) {
      ctas += '<a href="' + data.protoUrl + '" class="modal-cta modal-cta--proto" target="_blank" rel="noopener noreferrer">View prototype &rarr;</a>';
    }
    return (
      '<span class="modal-tag">' + data.label + ' &middot; ' + data.tag + '</span>' +
      '<h2 class="modal-title" id="modal-title-el">' + data.title + '</h2>' +
      '<div class="modal-metrics">' + metrics + '</div>' +
      '<div class="modal-divider"></div>' +
      '<p class="modal-section-label">The Problem</p>' +
      '<p class="modal-text">' + data.problem + '</p>' +
      '<p class="modal-section-label">Approach</p>' +
      '<p class="modal-text">' + data.approach + '</p>' +
      '<p class="modal-section-label">Key Outcomes</p>' +
      '<ul class="modal-list">' + outcome + '</ul>' +
      '<div class="modal-ctas">' + ctas + '</div>'
    );
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest('.carousel-card');
    if (!card) return;
    var type = card.getAttribute('data-modal');
    var idx  = parseInt(card.getAttribute('data-idx'), 10);
    if (type === 'proj') openModal(buildProjectModal(PROJ_DATA[idx]));
    if (type === 'cs')   openModal(buildCsModal(CS_DATA[idx]));
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });
})();
