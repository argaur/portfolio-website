/* ============================================================
   app.js — Blueprint to Bits Portfolio
   Panel nav · Experience accordion · Project modal · CS modal
   ============================================================ */

(function () {
  'use strict';

  /* ---- Panel Navigation ---- */
  function activatePanel(panelId) {
    document.querySelectorAll('.panel').forEach(function (p) {
      p.classList.remove('is-active', 'is-revealing');
    });
    var target = document.getElementById(panelId);
    if (target) {
      target.classList.add('is-active');
      target.scrollTop = 0;
      // Dispatch event for canvas lifecycle and other listeners
      document.dispatchEvent(new CustomEvent('panel:activate', { detail: { panelId: panelId } }));
      // Progressive reveal: double-rAF ensures display:block is painted before animation
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          target.classList.add('is-revealing');
        });
      });
    }
    document.querySelectorAll('.nav-link[data-panel]').forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.panel === panelId);
    });
  }

  document.querySelectorAll('[data-panel]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      activatePanel(el.dataset.panel);
      closeOverlay();
    });
  });

  /* ---- Mobile Overlay Nav ---- */
  var overlay      = document.getElementById('nav-overlay');
  var hamburger    = document.getElementById('nav-hamburger');
  var overlayClose = document.getElementById('nav-overlay-close');

  function openOverlay() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openOverlay);
  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOverlay();
  });

  /* Hash routing on load */
  var hashToPanel = {
    'home':         'panel-home',
    'experience':   'panel-experience',
    'work':         'panel-work',
    'projects':     'panel-projects',
    'skills':       'panel-skills',
    'philosophy':   'panel-philosophy',
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
  var modalOverlay = document.getElementById('modal-overlay');
  var modalBody    = document.getElementById('modal-body');
  var modalPanel   = document.getElementById('modal-panel');
  var closeBtn     = document.getElementById('modal-close');

  function closeModal() {
    modalOverlay.setAttribute('hidden', '');
    if (modalPanel) modalPanel.classList.remove('modal-panel--wide');
  }

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeOverlay(); }
  });

  /* ---- Work Project Modal ---- */
  var workProjects = [
    {
      tag: 'AI · HR Tech',
      title: 'AI-Powered Talent Management Suite',
      detail: 'Designed and shipped a full ATS with AI-powered screening, job description generation, and candidate-role matching. Integrated with existing HRMS for seamless data flow across the talent lifecycle. Deployed for 200+ hiring managers across 16 enterprise clients.',
      metrics: ['50% faster hiring', '200+ hiring managers', '40% internal mobility↑'],
      narrative: [
        { label: 'Overview', body: 'End-to-end talent management suite combining an Applicant Tracking System and Internal Job Portal, built for a 5,000+ employee BPO organization across 16 enterprise clients.' },
        { label: 'What I drove', body: 'Owned product strategy and roadmap end-to-end. Worked directly with engineering — no BA or JPM. Defined requirements, ran UAT, and managed phased rollout to 200+ hiring managers.' },
        { label: 'Impact', body: '50% reduction in hiring time · 40% increase in internal mobility · adopted by 200+ hiring managers across 16 clients.' }
      ]
    },
    {
      tag: 'AI · Performance',
      title: 'Performance Management Platform',
      detail: 'Replaced annual review cycles with continuous feedback loops. AI recommendation engine surfaces personalized development actions based on role, tenure, and past performance data. Single multi-tenant architecture deployed across 16 enterprise clients.',
      metrics: ['60% less manual review', '15 FTEs saved', '25% engagement↑'],
      narrative: [
        { label: 'Overview', body: 'Performance monitoring tool built from scratch on Airtable with AI automations, serving 5,000+ employees across all BPO verticals at JindalX.' },
        { label: 'What I drove', body: 'Sole PM and builder. Designed the data model, built automation workflows in Airtable, managed rollout, and trained business users. No engineering dependency — no-code + AI stack throughout.' },
        { label: 'Impact', body: '15 FTEs saved · 25% agent engagement increase · 60% reduction in manual review effort.' }
      ]
    },
    {
      tag: 'EdTech · AI',
      title: 'Knowledge & Learning Platform (Insight)',
      detail: 'Intelligent learning pathways adapt to agent performance data in real-time. Integrated chatbot handles 60% of queries without human escalation. Reduced onboarding time and improved frontline performance across 10,000+ seat operations.',
      metrics: ['45% performance↑', '35% training time↓', '60% faster resolution'],
      narrative: [
        { label: 'Overview', body: 'Internal knowledge management and L&D platform with integrated AI chatbot for BPO agent training and performance support across JindalX operations.' },
        { label: 'What I drove', body: 'Product strategy, vendor coordination, content architecture, and AI integration roadmap. Coordinated across L&D, operations, and engineering teams.' },
        { label: 'Impact', body: '45% agent performance improvement · 35% reduction in training time · 60% faster issue resolution.' }
      ]
    },
    {
      tag: 'B2B · CRM',
      title: 'B2B CRM & Auction Platform (AuctionIT)',
      detail: 'Full auction lifecycle management from listing through settlement. Automated invoicing eliminated manual reconciliation entirely. The UX redesign drove the 30% transaction volume increase.',
      metrics: ['30% transactions↑', 'Auto-invoicing', 'CRM integration'],
      narrative: [
        { label: 'Overview', body: 'B2B metal scrap auction platform connecting large manufacturers to SME dealers with automated bidding, settlement, and invoicing workflows.' },
        { label: 'What I drove', body: 'Led product roadmap for CRM and auction modules. Defined workflows, ran discovery with business stakeholders, and coordinated engineering delivery.' },
        { label: 'Impact', body: '30% increase in transaction volume · automated invoicing deployed · full CRM integration completed.' }
      ]
    },
    {
      tag: 'HRMS · Automation',
      title: 'HR Management System (Touchpoint HRMS)',
      detail: 'Handles shift workers, floating assignments, and multi-state compliance challenges unique to BPO operations. Full RESTful API integration with ERP backbone.',
      metrics: ['5,000+ agents', '25% satisfaction↑', 'Full ERP integration'],
      narrative: [
        { label: 'Overview', body: 'Internal HRMS serving 5,000+ BPO agents with attendance, payroll coordination, and employee self-service capabilities across JindalX delivery centers.' },
        { label: 'What I drove', body: 'Product ownership across HRMS modules. Stakeholder management across HR, operations, and engineering. Managed rollout planning and transition to live operations.' },
        { label: 'Impact', body: '5,000+ users onboarded · 25% employee satisfaction increase · full ERP integration achieved.' }
      ]
    },
    {
      tag: 'Analytics · BI',
      title: 'Business Intelligence Platform (Jx Data Cloud)',
      detail: 'Replaced 7 siloed spreadsheet-based reports with a single real-time warehouse. Automated ETL pipelines reduced data engineering toil by 35%.',
      metrics: ['40% accuracy↑', '35% processing↓', 'Multi-source ETL'],
      narrative: [
        { label: 'Overview', body: 'Centralized analytics platform unifying data from multiple enterprise systems into a single reporting layer for JindalX leadership decision-making.' },
        { label: 'What I drove', body: 'Led product and data architecture decisions. Coordinated across data engineering, business units, and executive stakeholders on requirements and delivery.' },
        { label: 'Impact', body: '40% improvement in reporting accuracy · 35% reduction in data processing time · multi-source ETL pipeline operational.' }
      ]
    },
    {
      tag: 'Platform · EdTech',
      title: 'Passport & PassportOS — OneValley',
      detail: 'Led product strategy and roadmap for B2C and B2B entrepreneurship platforms supporting global programs including Entrepreneurship World Cup. Served universities, banks, accelerators, and corporate incubators across India and international markets. Drove feature development, KPI frameworks, mentorship systems, and SaaS ecosystem integration.',
      metrics: ['B2B + B2C product lines', 'Global multi-client SaaS', 'Startup ecosystem platform'],
      narrative: [
        { label: 'Overview', body: 'B2C and B2B entrepreneurship platform supporting global startup ecosystems — Passport for individual founders, PassportOS for corporations and governments running accelerators.' },
        { label: 'What I drove', body: 'Owned full product roadmap across both product lines. Led Entrepreneurship World Cup initiative across 200+ countries. Established Queens University partnership for virtual incubation program.' },
        { label: 'Impact', body: 'Platform serving global multi-client SaaS model · partnerships operational across 200+ countries · corporate and university program adoption via PassportOS.' }
      ]
    },
    {
      tag: 'Content · Platform',
      title: 'Digital Content & Publishing Platform — Taccomacco',
      detail: 'As Co-Founder & COO, built the content pipeline and publishing infrastructure from scratch. Designed version control workflows, creator onboarding, and multi-channel distribution. Ran a structured incubation program that helped 6+ creators go from idea to published digital titles.',
      metrics: ['500+ digital titles launched', '6 creators incubated', 'Full content pipeline built'],
      narrative: [
        { label: 'Overview', body: 'Mobile reading app — B2C subscription platform for digital content discovery and creator publishing. Co-founded and led as COO from 0 to launch.' },
        { label: 'What I drove', body: 'Led product as Co-Founder & COO. Defined roadmap, pricing strategy, content architecture, and technology direction independently from 0 to launch.' },
        { label: 'Impact', body: '500+ digital titles launched in 6 months · 6 creators incubated from idea to published product · covered by YourStory.' }
      ]
    },
    {
      tag: 'Architecture · PM',
      title: 'Architectural Projects Portfolio — RSP Design Consultants',
      detail: 'Managed 40+ architectural and interior design projects across IT campuses, healthcare facilities, and institutional buildings. Introduced project management best practices that reduced delivery time by 25% and maintained a 95% client retention rate across a 3-year tenure.',
      metrics: ['40+ projects delivered', '95% client retention', '25% faster delivery'],
      narrative: [
        { label: 'Overview', body: 'Large-scale architectural projects across IT parks, healthcare, and institutional sectors in India — managed across a 3-year tenure at RSP Design Consultants.' },
        { label: 'What I drove', body: 'Managed 40+ projects end-to-end. Coordinated multidisciplinary teams, client relationships, and structured delivery planning across concurrent projects.' },
        { label: 'Impact', body: '40+ projects delivered · 95% client retention rate · 25% improvement in delivery timelines.' }
      ]
    }
  ];

  function openProjectModal(idx) {
    var p = workProjects[idx];
    var metricsHtml = (p.metrics || []).map(function (m) {
      return '<span class="modal-metric">' + m + '</span>';
    }).join('');

    var narrativeHtml = '';
    if (p.narrative && p.narrative.length) {
      var parts = p.narrative.map(function (part, i) {
        var num = String(i + 1).padStart(2, '0');
        return '<div class="modal-part">' +
          '<div class="modal-part-header">' +
            '<span class="modal-part-num">' + num + '</span>' +
            '<span class="modal-part-label">' + part.label + '</span>' +
          '</div>' +
          '<p class="modal-part-body">' + part.body + '</p>' +
        '</div>';
      }).join('');
      narrativeHtml = '<div class="modal-narrative">' + parts + '</div>';
    }

    if (p.narrative && p.narrative.length) {
      modalPanel.classList.add('modal-panel--wide');
    } else {
      modalPanel.classList.remove('modal-panel--wide');
    }

    modalBody.innerHTML =
      '<div class="modal-tag">' + p.tag + '</div>' +
      '<h2 class="modal-title">' + p.title + '</h2>' +
      '<p class="modal-detail">' + p.detail + '</p>' +
      '<div class="modal-metrics">' + metricsHtml + '</div>' +
      narrativeHtml;
    modalOverlay.removeAttribute('hidden');
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
      title: "Rethink CRM — Conversation-First Sales Tool",
      problem: "60–70% of founders abandon CRM within 4 weeks. The real insight: founders already manage relationships in WhatsApp. The tool had to meet them there.",
      insight: "WhatsApp forwards become structured deal data through a Telegram bot interface — zero context-switching, no new app to learn.",
      stats: ['39-page PRD', '16 tools analysed', '10 founder interviews'],
      stage: 'PRD · Prototype',
      stageTags: 'prd,prototype',
      industryTags: ['AI', 'B2B', 'Sales'],
      retrospective: '',
      githubUrl: 'https://github.com/argaur/founder-crm-bot',
      protoUrl: 'https://argaur.github.io/founder-crm-landing/',
      pageUrl: 'case-study-founder-crm.html'
    },
    {
      category: 'Quick Commerce · Operations',
      title: 'Blinkit Dark Store Command Hub — Peak-Hour Decision Support',
      problem: "Managers discover picker performance issues 3–7 minutes too late during the 6–10 PM peak window. By then the SLA is already broken.",
      insight: "A real-time command hub that surfaces picker-level alerts before the breach — turning reactive firefighting into proactive management.",
      stats: ['Working prototype', '3 research methods', 'Unit economics modelled'],
      stage: 'PRD · Prototype · Shipped',
      stageTags: 'prd,prototype,shipped',
      industryTags: ['AI', 'Ops', 'Consumer'],
      retrospective: '',
      githubUrl: null,
      protoUrl: 'https://blinkit-command-hub.vercel.app/',
      pageUrl: 'case-study-blinkit.html'
    },
    {
      category: 'Consumer Platform · Algorithm',
      title: 'YouTube 2.0 — Fixing Long-Form Discovery',
      problem: "47% of users manually search every session. 29% of Gen Z sessions end without watching anything. The algorithm optimises for click, not for satisfaction.",
      insight: "Four product interventions targeting the discovery gap — from contextual playlists to an intent-aware home feed redesign.",
      stats: ['171 survey responses', '4 product solutions', '27+ sources'],
      stage: 'PRD · Wireframes · Prototype',
      stageTags: 'prd,prototype',
      industryTags: ['Consumer', 'Discovery'],
      retrospective: '',
      githubUrl: null,
      protoUrl: null,
      pageUrl: 'case-study-youtube.html'
    },
    {
      category: 'Consumer App · AI',
      title: 'Trivo — Group Travel Planning Platform',
      problem: "1–2 people absorb 80%+ of planning load in a $168.7B market. Budget misalignments and preference conflicts surface mid-trip, not during planning.",
      insight: "An AI-powered coordination layer that distributes planning tasks, surfaces conflicts early, and keeps the whole group aligned without a group chat.",
      stats: ['6 user interviews', '$168.7B market', 'Full PRD'],
      stage: 'PRD · Prototype',
      stageTags: 'prd,prototype',
      industryTags: ['AI', 'Consumer', 'Platform'],
      retrospective: '',
      githubUrl: 'https://github.com/argaur/group-travel-pwa',
      protoUrl: 'https://frontend-argaurs-projects.vercel.app',
      pageUrl: 'case-study-group-travel.html'
    },
    {
      category: 'Health Tech · AI · PWA',
      title: 'Vitae — Health Records, Finally Understood',
      problem: "Indian families manage health via blurry WhatsApp prescription photos. ₹6,000+ crore lost annually to repeat diagnostic tests.",
      insight: "A PWA that turns prescription photos into structured, searchable health timelines — built by a 6-person team and shipped in 10 days.",
      stats: ['Live product', '6-person team', '10 days shipped'],
      stage: 'PRD · Shipped',
      stageTags: 'prd,shipped',
      industryTags: ['AI', 'HealthTech'],
      retrospective: '',
      githubUrl: 'https://github.com/aashikvilla/health-assistant',
      protoUrl: 'https://vitae-health.vercel.app/',
      pageUrl: 'case-study-vitae.html'
    }
  ];

  /* ---- Personal Projects ---- */
  var personalProjects = [
    {
      category: 'Python · Telegram · AI · Automation',
      title: 'Telegram Personal Assistant Bot',
      problem: 'Every personal workflow lived in a different app — Gmail, Notion, Obsidian, Calendar, GitHub. Context-switching was the tax on getting anything done.',
      insight: 'One Telegram message routes to any system. 28+ keyword commands cover content creation, task management, and information retrieval — with Claude Haiku as the freetext catch-all.',
      stats: ['28+ commands', '5 daily automations', '10 integrations'],
      stage: 'Shipped · Active',
      stageTags: 'shipped',
      industryTags: ['Infra', 'Automation'],
      githubUrl: 'https://github.com/argaur/telegram-bot',
      protoUrl: null,
      pageUrl: 'project-telegram-bot.html',
      pageLabel: 'Read Full Project Details'
    },
    {
      category: 'HTML · CSS · JavaScript · Supabase',
      title: 'This Portfolio Website',
      problem: 'Plain HTML/CSS/JS SPA with an email gate, Supabase lead capture, and a Blueprint-to-Bits design system.',
      insight: "Zero-dependency panel navigation and a CSS-only grid theme prove you don't need a framework to ship a polished product.",
      stats: ['0 npm dependencies', 'Supabase email gate', '8 panel SPA'],
      stage: 'Shipped · Live',
      stageTags: 'shipped',
      industryTags: ['Infra'],
      githubUrl: 'https://github.com/argaur/portfolio-website',
      protoUrl: null,
      pageUrl: 'project-portfolio.html',
      pageLabel: 'Read Full Project Details'
    },
    {
      category: 'Docker · Linux Mint · DevOps',
      title: 'Personal Homelab Server',
      problem: 'Self-hosting 10+ services — monitoring, automation, secrets management, DNS filtering — without cloud costs or vendor lock-in.',
      insight: 'Each service runs in an isolated Docker stack. HashiCorp Vault handles secrets, Prometheus + Grafana handle observability, and Ansible automates provisioning — zero plaintext credentials anywhere.',
      stats: ['10+ Docker services', 'HashiCorp Vault', 'Prometheus + Grafana'],
      stage: 'Shipped · Active',
      stageTags: 'shipped',
      industryTags: ['Infra'],
      githubUrl: 'https://github.com/argaur/homelab-v2',
      protoUrl: null,
      pageUrl: 'project-homelab.html',
      pageLabel: 'Read Full Project Details'
    },
    {
      category: 'Python · Gmail API · Google Calendar',
      title: 'GWS CLI',
      problem: 'Command-line tool for Gmail and Google Calendar — search, draft, and schedule without opening a browser.',
      insight: 'Thin Python wrappers over Google APIs with a clean CLI UX; Telegram trigger integration in progress.',
      stats: ['Gmail API', 'Calendar API', 'Telegram trigger WIP'],
      stage: 'Shipped · Active',
      stageTags: 'shipped',
      industryTags: ['Infra', 'Automation'],
      githubUrl: 'https://github.com/argaur/gws-cli',
      protoUrl: null,
      pageUrl: 'project-gws-cli.html',
      pageLabel: 'Read Full Project Details'
    }
  ];

  function buildModalActions(item) {
    var html = '<div class="modal-actions">';
    if (item.githubUrl) {
      html += '<a href="' + item.githubUrl + '" target="_blank" rel="noopener" class="modal-btn modal-btn--ghost">GitHub Repo &rarr;</a>';
    }
    if (item.protoUrl) {
      html += '<a href="' + item.protoUrl + '" target="_blank" rel="noopener" class="modal-btn modal-btn--primary">View Prototype &rarr;</a>';
    }
    if (item.pageUrl) {
      var pageLabel = item.pageLabel || 'Read Full Case Study';
      html += '<a href="' + item.pageUrl + '" class="modal-btn modal-btn--secondary">' + pageLabel + ' &rarr;</a>';
    }
    html += '</div>';
    return html;
  }

  function openItemModal(item) {
    modalPanel.classList.remove('modal-panel--wide');
    var industryHtml = (item.industryTags && item.industryTags.length)
      ? '<div class="modal-industry-tags">' +
          item.industryTags.map(function (t) { return '<span class="modal-industry-tag">' + t + '</span>'; }).join('') +
        '</div>'
      : '';
    var retroHtml = item.retrospective
      ? '<div class="modal-section-label">What I\'d do differently</div>' +
        '<p class="modal-insight">' + item.retrospective + '</p>'
      : '';
    modalBody.innerHTML =
      '<div class="modal-tag">' + item.category + '</div>' +
      industryHtml +
      '<h2 class="modal-title">' + item.title + '</h2>' +
      '<p class="modal-detail">' + item.problem + '</p>' +
      '<div class="modal-section-label">The Insight</div>' +
      '<p class="modal-insight">' + item.insight + '</p>' +
      '<div class="modal-stats">' +
        item.stats.map(function (s) {
          return '<span class="modal-stat-chip">' + s + '</span>';
        }).join('') +
      '</div>' +
      retroHtml +
      buildModalActions(item);
    modalOverlay.removeAttribute('hidden');
  }

  document.querySelectorAll('.cs-row').forEach(function (row) {
    row.addEventListener('click', function () {
      openItemModal(caseStudies[parseInt(row.dataset.cs, 10)]);
    });
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openItemModal(caseStudies[parseInt(row.dataset.cs, 10)]);
      }
    });
  });

  /* ---- Render Personal Project Rows ---- */
  var personalTable = document.getElementById('personal-projects-table');
  if (personalTable) {
    personalProjects.forEach(function (proj, i) {
      var row = document.createElement('div');
      row.className = 'cs-row reveal-child';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.dataset.personal = i;
      row.dataset.stage = proj.stageTags || '';
      var shippedClass = (proj.stageTags || '').indexOf('shipped') !== -1 ? ' stage-badge--shipped' : '';
      row.innerHTML =
        '<span class="cs-index">0' + (i + 1) + '</span>' +
        '<div class="cs-content">' +
          '<div class="cs-category">' + proj.category + '</div>' +
          '<div class="cs-name">' + proj.title + '</div>' +
          '<div class="cs-problem">' + proj.problem + '</div>' +
          (proj.stage ? '<span class="stage-badge' + shippedClass + '">' + proj.stage + '</span>' : '') +
        '</div>' +
        '<div class="cs-stats">' +
          proj.stats.map(function (s) { return '<span>' + s + '</span>'; }).join('') +
          '<span class="cs-arrow">&rarr;</span>' +
        '</div>';
      row.addEventListener('click', function () {
        openItemModal(personalProjects[parseInt(row.dataset.personal, 10)]);
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openItemModal(personalProjects[parseInt(row.dataset.personal, 10)]);
        }
      });
      personalTable.appendChild(row);
    });
  }

  /* ---- Projects Filter Bar ---- */
  var filterBtns = document.querySelectorAll('#projects-filter .pf-btn');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.classList.remove('pf-btn--active'); });
        btn.classList.add('pf-btn--active');
        document.querySelectorAll('.cs-row').forEach(function (row) {
          if (filter === 'all') {
            row.style.display = '';
          } else {
            var tags = (row.dataset.stage || '').split(',');
            row.style.display = tags.indexOf(filter) !== -1 ? '' : 'none';
          }
        });
      });
    });
  }

  /* ---- Cert Modal ---- */
  var certData = {
    'rethink-mpm':        { name: 'Product Management (MPM) Cohort 7', issuer: 'Rethink AI', year: '2026', pdfUrl: 'assets/rethink-cert.pdf', verifyUrl: null },
    'rethink-buildathon': { name: 'Rethink Buildathon', issuer: 'Rethink AI', year: 'April 2026', pdfUrl: 'assets/certs/rethink-buildathon.pdf', verifyUrl: null },

    'csm':              { name: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance', year: '2025', pdfUrl: 'assets/certs/csm.pdf', verifyUrl: 'https://certification.scrumalliance.org/accounts/1760465-gaurav-gupta/certifications/2087011-csm' },
    'cspo':             { name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', year: '2025', pdfUrl: 'assets/certs/cspo.pdf', verifyUrl: 'https://certification.scrumalliance.org/accounts/1760465-gaurav-gupta/certifications/2102661-cspo' },
    'automation-anywhere': { name: 'Essentials Automation Certification', issuer: 'Automation Anywhere', year: '2025', pdfUrl: null, verifyUrl: 'https://certificates.automationanywhere.com/a24976ab-4809-4d8c-85a9-82ac8b2836b9' },
    'airtable-admin':   { name: 'Airtable Admin', issuer: 'Airtable', year: '2024', pdfUrl: 'assets/certs/airtable-admin.pdf', verifyUrl: 'https://verify.skilljar.com/c/pxw5zdsqq2qj' },
    'airtable-builder': { name: 'Airtable Builder Certification', issuer: 'Airtable', year: '2024', pdfUrl: 'assets/certs/airtable-builder.pdf', verifyUrl: 'https://verify.skilljar.com/c/itfxffciw2bn' },
    'power-bi':         { name: 'Learning Power BI Desktop', issuer: 'LinkedIn Learning', year: '2024', pdfUrl: null, verifyUrl: 'https://www.linkedin.com/learning/certificates/5a507a9f4113ad4c3efb57c82d7e82b725cc00f3369471368e4f26f79811c72b/' },
    'lean':             { name: 'Lean Certification', issuer: 'JindalX', year: '2023', pdfUrl: 'assets/certs/lean.pdf', verifyUrl: null },
    'sql':              { name: 'SQL for Data Analytics & Business Intelligence', issuer: 'Udemy', year: '2020', pdfUrl: 'assets/certs/sql.pdf', verifyUrl: 'https://www.udemy.com/certificate/UC-e2df66ab-5af3-4a05-817b-61e4a16a2109/' },
    'data-science':     { name: 'Applied Data Science with Python — Level 2', issuer: 'IBM / Cognitive Class', year: '2020', pdfUrl: 'assets/certs/data-science-ibm.pdf', verifyUrl: 'https://www.youracclaim.com/badges/ab5ebc91-23a4-4568-9586-cf987f51e368/linked_in_profile' },
    'pm-cert':          { name: 'Product Management Professional Certificate', issuer: 'Udemy', year: null, pdfUrl: 'assets/certs/product-management.pdf', verifyUrl: 'https://www.udemy.com/certificate/UC-9034c06a-c9bc-4b88-906b-07f4abb94f42/' }
  };

  function openCertModal(key) {
    var cert = certData[key];
    if (!cert) return;
    modalPanel.classList.add('modal-panel--wide');
    var embedHtml = cert.pdfUrl
      ? '<div class="cert-modal-embed">' +
          '<iframe src="' + cert.pdfUrl + '" width="100%" height="500" style="border:none;display:block;"></iframe>' +
          '<p class="cert-modal-fallback">Can\'t see the PDF? <a href="' + cert.pdfUrl + '" target="_blank" rel="noopener">Open in new tab &rarr;</a></p>' +
        '</div>'
      : '';
    var actionsHtml = cert.verifyUrl
      ? '<div class="modal-actions"><a href="' + cert.verifyUrl + '" target="_blank" rel="noopener" class="modal-btn modal-btn--primary">Verify Certificate &rarr;</a></div>'
      : '';
    modalBody.innerHTML =
      '<div class="cert-modal-meta">' + cert.issuer + (cert.year ? ' &middot; ' + cert.year : '') + '</div>' +
      '<h2 class="cert-modal-name">' + cert.name + '</h2>' +
      '<div class="cert-modal-divider"></div>' +
      embedHtml +
      actionsHtml;
    modalOverlay.removeAttribute('hidden');
  }

  document.querySelectorAll('[data-cert]').forEach(function (row) {
    row.addEventListener('click', function () { openCertModal(row.dataset.cert); });
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCertModal(row.dataset.cert); }
    });
  });

  /* ============================================================
     SYSTEMS CANVAS — Hero Right Pane
     ============================================================ */
  function initSystemsCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W = 0, H = 0;
    var rafId = null;
    var mouse = { x: -9999, y: -9999, active: false };
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var nodes = [
      { id: 'arch',   label: 'ARCHITECTURE',   x: 0.18, y: 0.22, r: 5, primary: true  },
      { id: 'prod',   label: 'PRODUCT',        x: 0.50, y: 0.30, r: 7, primary: true  },
      { id: 'ai',     label: 'AI SYSTEMS',     x: 0.80, y: 0.22, r: 6, primary: true  },
      { id: 'ent',    label: 'ENTERPRISE',     x: 0.30, y: 0.50, r: 4, primary: false },
      { id: 'wf',     label: 'WORKFLOWS',      x: 0.65, y: 0.50, r: 4, primary: false },
      { id: 'agents', label: 'AGENTS',         x: 0.88, y: 0.42, r: 3, primary: false },
      { id: 'data',   label: 'DATA',           x: 0.12, y: 0.62, r: 3, primary: false },
      { id: 'infra',  label: 'INFRASTRUCTURE', x: 0.22, y: 0.78, r: 3, primary: false },
      { id: 'ops',    label: 'OPERATIONS',     x: 0.45, y: 0.72, r: 3, primary: false },
      { id: 'users',  label: 'USERS',          x: 0.58, y: 0.85, r: 4, primary: false },
      { id: 'design', label: 'DESIGN',         x: 0.75, y: 0.78, r: 3, primary: false },
      { id: 'strat',  label: 'STRATEGY',       x: 0.92, y: 0.62, r: 3, primary: false }
    ];

    var edges = [
      ['arch','prod'], ['prod','ai'], ['arch','ent'], ['ent','prod'],
      ['prod','wf'], ['ai','agents'], ['ai','wf'], ['wf','ops'],
      ['data','ent'], ['data','ai'], ['infra','ops'], ['ops','users'],
      ['users','prod'], ['design','prod'], ['strat','ai'], ['strat','prod'],
      ['agents','wf']
    ];

    nodes.forEach(function (n) {
      n.bx = n.x; n.by = n.y;
      n.dx = 0;   n.dy = 0;
      n.phaseX = Math.random() * Math.PI * 2;
      n.phaseY = Math.random() * Math.PI * 2;
      n.speedX = 0.0003 + Math.random() * 0.0003;
      n.speedY = 0.0003 + Math.random() * 0.0003;
      n.pulse  = Math.random() * Math.PI * 2;
    });

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      W = rect.width;
      H = rect.height;
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function nodePos(n) {
      var x = (n.bx + n.dx) * W;
      var y = (n.by + n.dy) * H;
      if (mouse.active) {
        var dx = mouse.x - x, dy = mouse.y - y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          var pull = (1 - dist / 200) * 12;
          x += (dx / dist) * pull;
          y += (dy / dist) * pull;
        }
      }
      return { x: x, y: y };
    }

    function frame(t) {
      if (W === 0 || H === 0) { resize(); rafId = requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, W, H);

      if (!prefersReduced) {
        nodes.forEach(function (n) {
          n.dx = Math.sin(n.phaseX + t * n.speedX) * 0.012;
          n.dy = Math.cos(n.phaseY + t * n.speedY) * 0.012;
        });
      }

      ctx.lineWidth = 1;
      edges.forEach(function (e) {
        var a = nodes.find(function (n) { return n.id === e[0]; });
        var b = nodes.find(function (n) { return n.id === e[1]; });
        var pa = nodePos(a), pb = nodePos(b);
        ctx.strokeStyle = 'rgba(120,170,230,0.18)';
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });

      nodes.forEach(function (n) {
        var p = nodePos(n);
        var pulseR = prefersReduced ? n.r : n.r + Math.sin(n.pulse + t * 0.0015) * 0.6;

        if (n.primary) {
          var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 4);
          grad.addColorStop(0, 'rgba(191,92,58,0.28)');
          grad.addColorStop(1, 'rgba(191,92,58,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseR * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = n.primary ? '#bf5c3a' : 'rgba(120,170,230,0.85)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.fill();

        if (n.primary || W > 480) {
          ctx.font = '500 9px "DM Sans", system-ui, sans-serif';
          ctx.fillStyle = n.primary ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.42)';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.label, p.x + pulseR + 8, p.y);
        }
      });

      rafId = requestAnimationFrame(frame);
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.addEventListener('mouseleave', function () {
      mouse.active = false;
    });

    var ro = new ResizeObserver(resize);
    ro.observe(canvas);

    document.addEventListener('panel:activate', function (e) {
      if (e.detail.panelId === 'panel-home') {
        requestAnimationFrame(resize);
        if (!rafId) { rafId = requestAnimationFrame(frame); }
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });

    resize();
    rafId = requestAnimationFrame(frame);
  }

  /* ============================================================
     CONTACT CANVAS — Mini Bookend
     ============================================================ */
  function initContactCanvas() {
    var canvas = document.getElementById('contact-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W = 0, H = 0;
    var rafId = null;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var nodes = [
      { id: 'prod',  label: 'PRODUCT',  x: 0.28, y: 0.35, r: 6, primary: true  },
      { id: 'ai',    label: 'AI',       x: 0.72, y: 0.28, r: 5, primary: true  },
      { id: 'arch',  label: 'ARCH',     x: 0.18, y: 0.72, r: 4, primary: false },
      { id: 'strat', label: 'STRATEGY', x: 0.75, y: 0.72, r: 4, primary: false }
    ];
    var edges = [['prod','ai'],['prod','arch'],['ai','strat'],['arch','prod'],['ai','prod']];

    nodes.forEach(function (n) {
      n.bx = n.x; n.by = n.y; n.dx = 0; n.dy = 0;
      n.phaseX = Math.random() * Math.PI * 2;
      n.phaseY = Math.random() * Math.PI * 2;
      n.speedX = 0.0002 + Math.random() * 0.0002;
      n.speedY = 0.0002 + Math.random() * 0.0002;
      n.pulse  = Math.random() * Math.PI * 2;
    });

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      W = rect.width; H = rect.height;
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(t) {
      if (!W || !H) { resize(); rafId = requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, W, H);
      if (!prefersReduced) {
        nodes.forEach(function (n) {
          n.dx = Math.sin(n.phaseX + t * n.speedX) * 0.015;
          n.dy = Math.cos(n.phaseY + t * n.speedY) * 0.015;
        });
      }
      edges.forEach(function (e) {
        var a = nodes.find(function (n) { return n.id === e[0]; });
        var b = nodes.find(function (n) { return n.id === e[1]; });
        ctx.strokeStyle = 'rgba(120,170,230,0.14)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo((a.bx + a.dx) * W, (a.by + a.dy) * H);
        ctx.lineTo((b.bx + b.dx) * W, (b.by + b.dy) * H);
        ctx.stroke();
      });
      nodes.forEach(function (n) {
        var px = (n.bx + n.dx) * W, py = (n.by + n.dy) * H;
        var pulseR = prefersReduced ? n.r : n.r + Math.sin(n.pulse + t * 0.001) * 0.5;
        if (n.primary) {
          var g = ctx.createRadialGradient(px, py, 0, px, py, pulseR * 5);
          g.addColorStop(0, 'rgba(191,92,58,0.22)'); g.addColorStop(1, 'rgba(191,92,58,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(px, py, pulseR * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = n.primary ? '#bf5c3a' : 'rgba(120,170,230,0.7)';
        ctx.beginPath(); ctx.arc(px, py, pulseR, 0, Math.PI * 2); ctx.fill();
        ctx.font = '500 9px "DM Sans", system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.38)';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(n.label, px + pulseR + 8, py);
      });
      rafId = requestAnimationFrame(frame);
    }

    var ro = new ResizeObserver(resize);
    ro.observe(canvas);

    document.addEventListener('panel:activate', function (e) {
      if (e.detail.panelId === 'panel-contact') {
        requestAnimationFrame(resize);
        if (!rafId) { rafId = requestAnimationFrame(frame); }
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });

    resize();
  }

  /* ---- Init ---- */
  initSystemsCanvas();
  initContactCanvas();

})();
