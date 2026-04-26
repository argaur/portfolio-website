/* ============================================================
   app.js — Blueprint to Bits Portfolio
   Panel nav · Experience accordion · Project modal · CS modal
   ============================================================ */

(function () {
  'use strict';

  /* ---- Panel Navigation ---- */
  function activatePanel(panelId) {
    document.querySelectorAll('.panel').forEach(function (p) {
      p.classList.remove('is-active');
    });
    var target = document.getElementById(panelId);
    if (target) {
      target.classList.add('is-active');
      target.scrollTop = 0;
    }
    document.querySelectorAll('.nav-link[data-panel]').forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.panel === panelId);
    });
  }

  document.querySelectorAll('[data-panel]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      activatePanel(el.dataset.panel);
    });
  });

  /* Hash routing on load */
  var hashToPanel = {
    'home':         'panel-home',
    'experience':   'panel-experience',
    'work':         'panel-work',
    'case-studies': 'panel-case-studies',
    'skills':       'panel-skills',
    'credentials':  'panel-credentials',
    'contact':      'panel-contact'
  };
  var initHash = window.location.hash.replace('#', '');
  if (initHash && hashToPanel[initHash]) {
    activatePanel(hashToPanel[initHash]);
  }

  /* ---- Experience Accordion ---- */
  document.querySelectorAll('.exp-row').forEach(function (row) {
    row.addEventListener('click', function () {
      row.classList.toggle('is-open');
    });
  });

  /* ---- Shared Modal ---- */
  var overlay   = document.getElementById('modal-overlay');
  var modalBody = document.getElementById('modal-body');
  var closeBtn  = document.getElementById('modal-close');

  function closeModal() {
    overlay.setAttribute('hidden', '');
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---- Project Modal ---- */
  var projects = [
    {
      tag: 'AI · HR Tech',
      title: 'AI-Powered Talent Management Suite',
      detail: 'Designed and shipped a full ATS with AI-powered screening, job description generation, and candidate-role matching. Integrated with existing HRMS for seamless data flow across the talent lifecycle. Deployed for 200+ hiring managers across 16 enterprise clients.',
      metrics: ['50% faster hiring', '200+ hiring managers', '40% internal mobility↑']
    },
    {
      tag: 'AI · Performance',
      title: 'Performance Management Platform',
      detail: 'Replaced annual review cycles with continuous feedback loops. AI recommendation engine surfaces personalized development actions based on role, tenure, and past performance data. Single multi-tenant architecture deployed across 16 enterprise clients.',
      metrics: ['60% less manual review', '15 FTEs saved', '25% engagement↑']
    },
    {
      tag: 'EdTech · AI',
      title: 'Knowledge & Learning Platform (Insight)',
      detail: 'Intelligent learning pathways adapt to agent performance data in real-time. Integrated chatbot handles 60% of queries without human escalation. Reduced onboarding time and improved frontline performance across 10,000+ seat operations.',
      metrics: ['45% performance↑', '35% training time↓', '60% faster resolution']
    },
    {
      tag: 'B2B · CRM',
      title: 'B2B CRM & Auction Platform (AuctionIT)',
      detail: 'Full auction lifecycle management from listing through settlement. Automated invoicing eliminated manual reconciliation entirely. The UX redesign drove the 30% transaction volume increase.',
      metrics: ['30% transactions↑', 'Auto-invoicing', 'CRM integration']
    },
    {
      tag: 'HRMS · Automation',
      title: 'HR Management System (Touchpoint HRMS)',
      detail: 'Handles shift workers, floating assignments, and multi-state compliance challenges unique to BPO operations. Full RESTful API integration with ERP backbone.',
      metrics: ['5,000+ agents', '25% satisfaction↑', 'Full ERP integration']
    },
    {
      tag: 'Analytics · BI',
      title: 'Business Intelligence Platform (Jx Data Cloud)',
      detail: 'Replaced 7 siloed spreadsheet-based reports with a single real-time warehouse. Automated ETL pipelines reduced data engineering toil by 35%.',
      metrics: ['40% accuracy↑', '35% processing↓', 'Multi-source ETL']
    },
    {
      tag: 'Platform · EdTech',
      title: 'Passport & PassportOS — OneValley',
      detail: 'Led product strategy and roadmap for B2C and B2B entrepreneurship platforms supporting global programs including Entrepreneurship World Cup. Served universities, banks, accelerators, and corporate incubators across India and international markets. Drove feature development, KPI frameworks, mentorship systems, and SaaS ecosystem integration.',
      metrics: ['B2B + B2C product lines', 'Global multi-client SaaS', 'Startup ecosystem platform']
    },
    {
      tag: 'Content · Platform',
      title: 'Digital Content & Publishing Platform — Taccomacco',
      detail: 'As Co-Founder & COO, built the content pipeline and publishing infrastructure from scratch. Designed version control workflows, creator onboarding, and multi-channel distribution. Ran a structured incubation program that helped 6+ creators go from idea to published digital titles.',
      metrics: ['500+ digital titles launched', '6 creators incubated', 'Full content pipeline built']
    },
    {
      tag: 'Architecture · PM',
      title: 'Architectural Projects Portfolio — RSP Design Consultants',
      detail: 'Managed 40+ architectural and interior design projects across IT campuses, healthcare facilities, and institutional buildings. Introduced project management best practices that reduced delivery time by 25% and maintained a 95% client retention rate across a 3-year tenure.',
      metrics: ['40+ projects delivered', '95% client retention', '25% faster delivery']
    }
  ];

  function openProjectModal(idx) {
    var p = projects[idx];
    modalBody.innerHTML =
      '<div class="modal-tag">' + p.tag + '</div>' +
      '<h2 class="modal-title">' + p.title + '</h2>' +
      '<p class="modal-detail">' + p.detail + '</p>' +
      '<div class="modal-metrics">' +
        p.metrics.map(function (m) {
          return '<span class="modal-metric">' + m + '</span>';
        }).join('') +
      '</div>';
    overlay.removeAttribute('hidden');
  }

  document.querySelectorAll('.proj-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openProjectModal(parseInt(card.dataset.proj, 10));
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(parseInt(card.dataset.proj, 10));
      }
    });
  });

  /* ---- Case Study Modal ---- */
  var caseStudies = [
    {
      category: 'B2B SaaS · AI · Telegram Bot',
      title: "Founder's CRM — Conversation-First Sales Tool",
      problem: "60–70% of founders abandon CRM within 4 weeks. The real insight: founders already manage relationships in WhatsApp. The tool had to meet them there.",
      insight: "WhatsApp forwards become structured deal data through a Telegram bot interface — zero context-switching, no new app to learn.",
      stats: ['39-page PRD', '16 tools analysed', '10 founder interviews'],
      protoUrl: null,
      pageUrl: 'case-study-founder-crm.html'
    },
    {
      category: 'Quick Commerce · Operations',
      title: 'Peak-Hour Decision Support for Blinkit Dark Stores',
      problem: "Managers discover picker performance issues 3–7 minutes too late during the 6–10 PM peak window. By then the SLA is already broken.",
      insight: "A real-time command hub that surfaces picker-level alerts before the breach — turning reactive firefighting into proactive management.",
      stats: ['Working prototype', '3 research methods', 'Unit economics modelled'],
      protoUrl: 'https://blinkit-command-hub.vercel.app/',
      pageUrl: 'case-study-blinkit.html'
    },
    {
      category: 'Consumer Platform · Algorithm',
      title: 'YouTube 2.0 — Fixing Long-Form Discovery',
      problem: "47% of users manually search every session. 29% of Gen Z sessions end without watching anything. The algorithm optimises for click, not for satisfaction.",
      insight: "Four product interventions targeting the discovery gap — from contextual playlists to an intent-aware home feed redesign.",
      stats: ['171 survey responses', '4 product solutions', '27+ sources'],
      protoUrl: null,
      pageUrl: 'case-study-youtube.html'
    },
    {
      category: 'Consumer App · AI',
      title: 'Group Travel Planning Platform',
      problem: "1–2 people absorb 80%+ of planning load in a $168.7B market. Budget misalignments and preference conflicts surface mid-trip, not during planning.",
      insight: "An AI-powered coordination layer that distributes planning tasks, surfaces conflicts early, and keeps the whole group aligned without a group chat.",
      stats: ['6 user interviews', '$168.7B market', 'Full PRD'],
      protoUrl: null,
      pageUrl: 'case-study-group-travel.html'
    },
    {
      category: 'Health Tech · AI · PWA',
      title: 'Vitae — Health Records, Finally Understood',
      problem: "Indian families manage health via blurry WhatsApp prescription photos. ₹6,000+ crore lost annually to repeat diagnostic tests.",
      insight: "A PWA that turns prescription photos into structured, searchable health timelines — built by a 6-person team and shipped in 10 days.",
      stats: ['Live product', '6-person team', '10 days shipped'],
      protoUrl: 'https://vitae-health.vercel.app/',
      pageUrl: 'case-study-vitae.html'
    }
  ];

  function openCsModal(idx) {
    var cs = caseStudies[idx];
    var actionsHtml = '<div class="modal-actions">';
    if (cs.protoUrl) {
      actionsHtml += '<a href="' + cs.protoUrl + '" target="_blank" rel="noopener" class="modal-btn modal-btn--primary">View Prototype &rarr;</a>';
    }
    actionsHtml += '<a href="' + cs.pageUrl + '" class="modal-btn modal-btn--secondary">Read Full Case Study &rarr;</a>';
    actionsHtml += '</div>';

    modalBody.innerHTML =
      '<div class="modal-tag">' + cs.category + '</div>' +
      '<h2 class="modal-title">' + cs.title + '</h2>' +
      '<p class="modal-detail">' + cs.problem + '</p>' +
      '<div class="modal-section-label">The Insight</div>' +
      '<p class="modal-insight">' + cs.insight + '</p>' +
      '<div class="modal-stats">' +
        cs.stats.map(function (s) {
          return '<span class="modal-stat-chip">' + s + '</span>';
        }).join('') +
      '</div>' +
      actionsHtml;
    overlay.removeAttribute('hidden');
  }

  document.querySelectorAll('.cs-row').forEach(function (row) {
    row.addEventListener('click', function () {
      openCsModal(parseInt(row.dataset.cs, 10));
    });
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCsModal(parseInt(row.dataset.cs, 10));
      }
    });
  });

})();
