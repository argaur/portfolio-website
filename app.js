/* ============================================================
   app.js — Portfolio v2
   Panel nav · Theme toggle · Experience accordion · Project modal
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

  /* ---- Theme Toggle ---- */
  var themeToggle = document.getElementById('theme-toggle');
  var savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  if (savedTheme === 'light') document.body.classList.add('theme-light');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isLight = document.body.classList.toggle('theme-light');
      localStorage.setItem('portfolio_theme', isLight ? 'light' : 'dark');
    });
  }

  /* Hash routing on load */
  var hashToPanel = {
    'home':         'panel-home',
    'experience':   'panel-experience',
    'work':         'panel-work',
    'projects':     'panel-projects',
    'how-i-think':  'panel-how-i-think',
    'credentials':  'panel-credentials',
    'contact':      'panel-contact'
  };
  var initHash = window.location.hash.replace('#', '');
  if (initHash && hashToPanel[initHash]) {
    activatePanel(hashToPanel[initHash]);
  }

  /* ---- Experience Accordion (v2: .acc-row / .acc-header) ---- */
  document.querySelectorAll('.acc-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var row = header.closest('.acc-row');
      if (row) row.classList.toggle('open');
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

  /* ---- Work Project Data (14 projects, dynamically rendered) ---- */
  var workProjects = [
    /* JindalX — Xcellence lead, then ATS, AuctionIT, Jx Data Cloud, HRMS, AQUA, Insight */
    {
      company: 'jindal', role: 'Independent Builder · Strategist', year: '2023–2025',
      tag: 'AI · Performance',
      title: 'Performance Management Platform (Xcellence)',
      detail: 'Sole PM and builder — designed data models, built AI-powered automation on a no-code + GenAI stack, and deployed to 5,000+ employees across 16 enterprise clients with zero engineering team dependency.',
      technology: 'Generative AI APIs, Airtable (Advanced), REST APIs, SQL',
      activities: [
        'Defined product strategy independently and built the entire platform on a no-code + GenAI stack — sole PM and builder.',
        'Designed data models, automation workflows, and AI-powered performance scoring logic from scratch in Airtable.',
        'Owned product lifecycle end-to-end: requirements, build, testing, rollout, and business user training.',
        'Drove adoption across 16 enterprise clients through direct stakeholder engagement without engineering team dependency.',
        'Delivered 15 FTE savings through intelligent automation — fully self-built with zero traditional engineering dependency.'
      ],
      metrics: ['60% less manual review', '15 FTEs saved', '25% engagement↑']
    },
    {
      company: 'jindal', role: 'Independent Builder · Strategist', year: '2023–2025',
      tag: 'AI · HR Tech',
      title: 'AI-Powered Talent Management Suite',
      detail: 'Independently built and deployed GenAI hiring workflows — candidate screening, JD generation, and job matching — while owning full product strategy and rollout to 200+ hiring managers with no engineering dependency on the AI layer.',
      technology: 'Generative AI APIs, Airtable (Advanced), REST APIs, SQL',
      activities: [
        'Owned product vision, strategy, and roadmap end-to-end across ATS, IJP, and HRMS platforms.',
        'Independently built Generative AI-driven workflows for candidate screening, JD generation, and job matching using no-code + AI stack.',
        'Defined data architecture and integration approach with existing HRMS — no BA or JPM dependency.',
        'Led phased rollout to 200+ hiring managers, managing requirements, UAT, and go-live directly.',
        'Coordinated cross-functional stakeholders (HR, Operations, IT) while maintaining sole PM and builder accountability.'
      ],
      metrics: ['50% faster hiring', '200+ hiring managers', '40% internal mobility↑']
    },
    {
      company: 'jindal', role: 'Team Manager · Strategist', year: '2022–2025',
      tag: 'B2B · CRM',
      title: 'B2B CRM & Auction Platform (AuctionIT)',
      detail: 'Owned product strategy and led cross-functional squads to build end-to-end auction lifecycle and CRM management — drove 30% transaction growth through a UX redesign and managed multi-team delivery across concurrent workstreams.',
      technology: 'PHP/.NET, Microsoft Azure, REST APIs, SQL',
      activities: [
        'Owned product strategy and roadmap for CRM and auction modules — defined scope, prioritization, and release planning.',
        'Managed development teams and external integration partners across concurrent workstreams.',
        'Led UX strategy and redesign effort that drove 30% increase in transaction volume.',
        'Facilitated executive stakeholder communication, change control, and progress reporting.',
        'Oversaw UAT execution, release management, and operational transition.'
      ],
      metrics: ['30% transactions↑', 'Auto-invoicing', 'CRM integration']
    },
    {
      company: 'jindal', role: 'Team Manager · Strategist', year: '2022–2025',
      tag: 'Analytics · BI',
      title: 'Business Intelligence Platform (Jx Data Cloud)',
      detail: 'Defined data platform strategy and led teams to centralize distributed sources into a unified warehouse — built Power BI dashboards, automated KPI alerts for BPO operations, and ensured HIPAA compliance for US enterprise clients.',
      technology: 'SQL, Power BI, SQL Server Integration Services (SSIS)',
      activities: [
        'Owned data platform strategy, roadmap, and governance framework aligned with data privacy and retention policies.',
        'Centralized multiple distributed data sources into a unified warehouse; led ETL strategy on the central DB to surface actionable insights through Power BI dashboards.',
        'Delivered platform for enterprise clients including RCM-process-based US clients — ensured HIPAA compliance for all data handling and reporting workflows.',
        'Designed and created wireframes for all client dashboards, ensuring only approved layouts were handed to engineering for build.',
        'Implemented automated KPI alert logic that flagged falling hourly agent performance to BPO team leads for real-time intervention.',
        'Led cross-functional teams across data engineering, business units, and executive stakeholders for structured rollout.'
      ],
      metrics: ['40% accuracy↑', '35% processing↓', 'Multi-source ETL']
    },
    {
      company: 'jindal', role: 'Team Manager · Strategist', year: '2023–2025',
      tag: 'HRMS · Automation',
      title: 'HR Management System (Touchpoint HRMS)',
      detail: 'Led teams to build a purpose-built HRMS for 5,000+ floating BPO agents — defined product strategy for shift-based scheduling, multi-state compliance, and full ERP integration across a complex distributed workforce.',
      technology: 'REST APIs, ERP integration, SQL',
      activities: [
        'Defined product strategy for HRMS covering attendance, payroll, and compliance for floating workforce operations.',
        'Managed delivery teams across HR, engineering, and operations for multi-module rollout.',
        'Led architectural decisions for shift-based workflows and multi-state compliance requirements.',
        'Coordinated full ERP integration strategy with existing enterprise backbone.',
        'Oversaw phased rollout to 5,000+ agents, managing UAT, transition, and adoption.'
      ],
      metrics: ['5,000+ agents', '25% satisfaction↑', 'Full ERP integration']
    },
    {
      company: 'jindal', role: 'Team Manager · Strategist', year: '2022–2024',
      tag: 'Quality · Compliance',
      title: 'Quality Management & Auditing Platform (AQUA)',
      detail: 'Led cross-functional teams to deliver a cloud-based quality auditing and compliance platform — owned product strategy, governance frameworks, and enterprise-wide UAT coordination across system integrations.',
      technology: 'PHP/.NET, Microsoft Azure, REST APIs, SQL',
      activities: [
        'Defined product strategy, requirements, and implementation roadmap for quality and compliance workflows.',
        'Managed cross-functional teams for enterprise system integration and delivery.',
        'Established delivery governance including milestone tracking, RAID management, and risk mitigation.',
        'Led structured reporting cadence to leadership on compliance metrics and program progress.',
        'Oversaw UAT cycles and managed operational transition post-deployment.'
      ],
      metrics: ['Cloud-based auditing', 'Compliance workflows', 'Enterprise UAT']
    },
    {
      company: 'jindal', role: 'Team Manager · Strategist', year: '2022–2024',
      tag: 'EdTech · AI',
      title: 'Knowledge & Learning Platform (Insight)',
      detail: 'Led cross-functional teams to deliver an AI-powered knowledge and L&D platform for 5,000+ employees — owned product strategy, vendor coordination for AI chatbot integration, and phased rollout across BPO operations.',
      technology: 'PHP/.NET, Microsoft Azure, REST APIs, SQL',
      activities: [
        'Defined product strategy and roadmap for knowledge management and L&D platform serving 5,000+ employees.',
        'Managed cross-functional teams across engineering, content, L&D, and operations for structured delivery.',
        'Led vendor selection and coordination for AI-enabled knowledge search and chatbot integration.',
        'Governed delivery timelines, dependency tracking, risk management, and executive updates.',
        'Oversaw UAT planning, phased rollout, and operational handover to business teams.'
      ],
      metrics: ['45% performance↑', '35% training time↓', '60% faster resolution']
    },
    /* OneValley — B2B lead card first */
    {
      company: 'onevalley', role: 'Strategist · Stakeholder Lead', year: '2020–2022',
      tag: 'Platform · B2B',
      title: 'PassportOS — Ecosystem Platform',
      detail: 'Worked as the product manager for a B2B SaaS platform deployed for institutes, incubators, accelerators, universities, and banks — owned requirements, sprint delivery, stakeholder coordination, and KPI reporting across enterprise clients.',
      technology: 'Atlassian Confluence (platform base), REST APIs, SQL, SaaS integrations',
      activities: [
        'Managed product requirements, sprint planning, and delivery cycles for a B2B SaaS incubator and accelerator platform.',
        'Coordinated across enterprise clients — institutes, incubators, accelerators, universities, and banks — to gather requirements and align on rollouts.',
        'Established Queens University partnership for virtual incubation — managed requirements gathering, onboarding, and go-live.',
        'Defined integration requirements and multi-tenant configuration specifications for each client deployment.',
        'Monitored KPIs across active B2B programs and reported product performance to leadership.'
      ],
      metrics: ['B2B SaaS', 'University partnerships', 'Corporate incubators']
    },
    {
      company: 'onevalley', role: 'Product Contributor', year: '2020–2022',
      tag: 'Platform · B2C',
      title: 'Passport — Founder Platform',
      detail: 'Contributed to the B2C founder platform as part of the OneValley product team — supported feature delivery, roadmap planning, and KPI tracking for a global platform serving startup founders.',
      technology: 'Atlassian Confluence (platform base), REST APIs, SQL, third-party integrations',
      activities: [
        'Contributed to product roadmap planning and feature prioritization within the OneValley product team.',
        'Tracked and reported platform KPIs across the global base of startup founders using the platform.',
        'Supported engineering and ecosystem partner coordination for feature delivery cycles.',
        'Participated in sprint planning, milestone tracking, and release governance processes.',
        'Assisted UAT coordination and rollout support across product releases.'
      ],
      metrics: ['B2C platform', 'Global founders', 'Multi-feature']
    },
    {
      company: 'onevalley', role: 'Product Contributor · Stakeholder Lead', year: '2020–2022',
      tag: 'Program · Global',
      title: 'Entrepreneurship World Cup Platform',
      detail: 'Contributed to product delivery for the Entrepreneurship World Cup across 200+ countries — owned stakeholder coordination across national bodies, universities, and corporate partners as the connective tissue across a complex global program.',
      technology: 'Atlassian Confluence (platform base), REST APIs, SaaS ecosystem integrations',
      activities: [
        'Contributed to product delivery for Entrepreneurship World Cup spanning 200+ countries.',
        'Owned stakeholder coordination across national bodies, universities, and corporate program partners.',
        'Defined program workflows for application intake, judging panels, and participant management at scale.',
        'Managed time-bound release governance for global rollouts with fixed program deadlines.',
        'Acted as cross-functional connector across engineering, operations, and global program management.'
      ],
      metrics: ['200+ countries', 'Global rollout', 'Multi-stakeholder']
    },
    /* Taccomacco */
    {
      company: 'taccomacco', role: 'Product Lead · Co-Founder · Strategist', year: '2018–2020',
      tag: 'Mobile · B2C',
      title: 'Mobile Reading App — Android & iOS',
      detail: 'Co-founded and led product for a B2C subscription reading app from concept to live product on Android and iOS — defined strategy, led development teams, and owned every product decision from pricing through launch.',
      technology: 'Android, iOS, PHP backend',
      activities: [
        'Co-founded the venture and led product strategy from 0 to launch as Product Lead and COO.',
        'Defined pricing strategy, content architecture, user acquisition approach, and go-to-market plan.',
        'Led app development teams across Android and iOS platforms as the product decision-maker.',
        'Managed release schedules, scope prioritization, and stakeholder communication end-to-end.',
        'Oversaw testing, deployment, and initial scaling of mobile applications post-launch.'
      ],
      metrics: ['Android + iOS', 'B2C subscription', '0 to launch']
    },
    {
      company: 'taccomacco', role: 'Product Lead · Co-Founder · Strategist', year: '2018–2020',
      tag: 'Platform · CMS',
      title: 'Creator Publishing Dashboard',
      detail: 'Led product strategy and built internal CMS and publishing infrastructure from scratch as co-founder — structured workflows and distribution pipelines that enabled 500+ digital titles in 6 months.',
      technology: 'PHP, CMS workflows, publishing pipeline',
      activities: [
        'Defined product strategy for internal publishing infrastructure — led as Product Lead and Co-Founder.',
        'Built CMS workflows and version control systems enabling structured creator-to-publication pipeline.',
        'Designed multi-channel distribution architecture and content review governance processes.',
        'Led backend dashboard implementation and coordinated technical delivery teams.',
        'Enabled 500+ digital titles published in 6 months through the platform — a direct outcome of the product decisions made.'
      ],
      metrics: ['500+ titles launched', 'Creator publishing', 'CMS pipeline']
    },
    {
      company: 'taccomacco', role: 'Program Lead · Content Head', year: '2017–2020',
      tag: 'Program · Content',
      title: 'Creator Incubation Program',
      detail: 'Designed and ran a structured creator incubation program as Program Lead and Content Head — defined editorial frameworks, mentored 6 creators from idea to published product, and earned YourStory coverage.',
      technology: 'Content workflows, publishing tools',
      activities: [
        'Designed and led the creator incubation program structure — from intake criteria to published product milestones.',
        'Served as Content Head: defined editorial quality frameworks, content standards, and review processes.',
        'Onboarded, mentored, and guided 6 creators through the full development lifecycle from idea to publication.',
        'Coordinated cross-functional support across content, design, and tech teams for each creator track.',
        'Achieved YourStory coverage for the program\'s impact on the creator economy in digital publishing.'
      ],
      metrics: ['6 creators incubated', 'YourStory coverage', '0→published']
    },
    /* RSP Design Consultants */
    {
      company: 'rsp', role: 'Design Team Member', year: '2014–2017',
      tag: 'Architecture · PM',
      title: 'Architectural Projects Portfolio',
      detail: 'Contributed as a design team member at RSP, taking 40+ projects from initiation through government approval and submission drawings — with a dedicated compliance brief covering NBC, state and city bylaws, and special zone regulations.',
      technology: 'AutoCAD, project management frameworks, multidisciplinary coordination',
      activities: [
        'Contributed to design and delivery of 40+ architectural projects across IT campuses, healthcare, and institutional typologies.',
        'Managed project lifecycle from initiation through government approval and submission drawings stage.',
        'Tasked with compliance analysis across all projects — covered NBC, state bylaws, city bylaws, and special zone regulations including metro corridors, highways, and riverside development norms.',
        'Introduced structured PM frameworks that reduced delivery timelines by 25% across the team.',
        'Maintained 95% client retention through consistent stakeholder communication and delivery discipline.'
      ],
      metrics: ['40+ projects', '95% client retention', '25% faster delivery']
    }
  ];

  var _companyNames = {
    jindal: 'JindalX', onevalley: 'OneValley',
    taccomacco: 'Taccomacco Edutainment', rsp: 'RSP Design Consultants'
  };

  function openProjectModal(idx) {
    var p = workProjects[idx];
    if (!p) return;
    var companyLabel = _companyNames[p.company] || '';
    var metricsHtml = (p.metrics || []).map(function (m) {
      return '<span class="modal-metric">' + m + '</span>';
    }).join('');
    var activitiesHtml = '';
    if (p.activities && p.activities.length) {
      activitiesHtml =
        '<div class="modal-section-label">Activities</div>' +
        '<ul class="modal-activities">' +
        p.activities.map(function (a) { return '<li>' + a + '</li>'; }).join('') +
        '</ul>';
    }
    modalPanel.classList.add('modal-panel--wide');
    modalBody.innerHTML =
      '<div class="modal-header-chips">' +
        '<span class="modal-tag">' + p.tag + '</span>' +
        '<span class="modal-role">' + p.role + '</span>' +
      '</div>' +
      '<h2 class="modal-title">' + p.title + '</h2>' +
      '<p class="modal-company-year">' + companyLabel + ' &middot; ' + p.year + '</p>' +
      (p.technology ? '<div class="modal-tech-row"><strong>Technology:</strong> ' + p.technology + '</div>' : '') +
      activitiesHtml +
      '<div class="modal-metrics">' + metricsHtml + '</div>';
    modalOverlay.removeAttribute('hidden');
  }

  function renderWorkProjects() {
    var companies = ['jindal', 'onevalley', 'taccomacco', 'rsp'];
    companies.forEach(function (co) {
      var container = document.querySelector('.exp-projects[data-company="' + co + '"]');
      if (!container) return;
      var projects = workProjects.filter(function (p) { return p.company === co; });
      var html = '<div class="proj-grid">';
      projects.forEach(function (p, i) {
        var idx = workProjects.indexOf(p);
        var isLead = (i === 0);
        var metricsHtml = (p.metrics || []).map(function (m) {
          return '<span class="proj-metric">' + m + '</span>';
        }).join('');
        html +=
          '<div class="proj-card' + (isLead ? ' proj-card--lead' : '') + ' reveal-child"' +
          ' data-proj="' + idx + '" role="button" tabindex="0">' +
          '<div class="proj-card-meta">' +
            '<span class="proj-tag">' + p.tag + '</span>' +
            '<span class="proj-role-chip">' + p.role + '</span>' +
          '</div>' +
          '<h3 class="proj-title">' + p.title + '</h3>' +
          '<p class="proj-desc">' + p.detail + '</p>' +
          '<div class="proj-metrics">' + metricsHtml + '</div>' +
          '<span class="proj-cta">View details &rarr;</span>' +
          '</div>';
      });
      html += '</div>';
      container.innerHTML = html;
      container.querySelectorAll('.proj-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
          e.stopPropagation();
          openProjectModal(parseInt(card.dataset.proj, 10));
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            openProjectModal(parseInt(card.dataset.proj, 10));
          }
        });
      });
    });
  }

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
      stats: ['0 npm dependencies', 'Supabase email gate', '7 panel SPA'],
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
     ARCHITECTURE STACK — Hero Right Pane
     ============================================================ */
  function initStackDiagram() {
    var diagram = document.getElementById('stack-diagram');
    if (!diagram) return;

    var LOG_LINES = [
      '[2024] SCALE  ai.products → 7 deployed',
      '[2025] CONSULT  16 enterprise clients',
      '[2022] MIGRATE  → enterprise.pm @ JindalX',
      '[2023] INTEGRATE  airtable.platform × 16',
      '[2015] DEPLOY  ops.systems × RSP Group',
      '[2019] OPTIMIZE  process.efficiency → JindalX',
      '[2009] INIT  civil.engineering @ MNIT',
      '[2014] BUILD  load.bearing.thinking'
    ];

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var entries = diagram.querySelectorAll('.stack-log-entry');
    var hasAnimated = false;

    function showInstant() {
      entries.forEach(function (el, i) {
        el.textContent = LOG_LINES[i] || '';
      });
      diagram.classList.add('stack-solidified');
    }

    function animateStack() {
      if (hasAnimated) return;
      hasAnimated = true;

      if (prefersReduced) { showInstant(); return; }

      var MS_PER_CHAR = 16;
      var LINE_GAP    = 100;
      var totalDelay  = 0;

      entries.forEach(function (el, i) {
        var text = LOG_LINES[i] || '';
        var startAt = totalDelay;
        totalDelay += text.length * MS_PER_CHAR + LINE_GAP;

        setTimeout(function () {
          var pos = 0;
          var tick = setInterval(function () {
            pos += 1;
            el.textContent = text.slice(0, pos);
            if (pos >= text.length) {
              clearInterval(tick);
              if (i === entries.length - 1) {
                setTimeout(function () {
                  diagram.classList.add('stack-solidified');
                }, 200);
              }
            }
          }, MS_PER_CHAR);
        }, startAt);
      });
    }

    document.addEventListener('panel:activate', function (e) {
      if (e.detail.panelId === 'panel-home') {
        animateStack();
      }
    });

    if (document.getElementById('panel-home') &&
        document.getElementById('panel-home').classList.contains('is-active')) {
      animateStack();
    }
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
          g.addColorStop(0, 'rgba(201,168,76,0.22)'); g.addColorStop(1, 'rgba(201,168,76,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(px, py, pulseR * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = n.primary ? '#c9a84c' : 'rgba(120,170,230,0.7)';
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

  /* ---- Projects Panel (v2 — unified list) ---- */
  var allProjects = [
    { rank: '01', type: 'case-study', name: 'Vitae — Health Records, Finally Understood',       sub: 'Live prototype · Health tech · Redesigning health data for patients',          links: [{ label: 'View →', href: 'https://vitae-health.vercel.app/' }], itemRef: function(){ return caseStudies[4]; } },
    { rank: '02', type: 'personal',   name: 'Telegram PM Bot — Workflow Automation',            sub: 'Deployed · AI / Automation · Claude + Airtable + Notion integration',        links: [{ label: 'GitHub →', href: '#' }], itemRef: function(){ return personalProjects[0]; } },
    { rank: '03', type: 'case-study', name: 'Blinkit Command Hub — Peak-Hour Decision Support', sub: 'Live prototype · Ops / Quick Commerce · Real-time dark store dashboard',      links: [{ label: 'View →', href: 'https://blinkit-command-hub.vercel.app/' }], itemRef: function(){ return caseStudies[1]; } },
    { rank: '04', type: 'case-study', name: "Founder's CRM — Conversation-First Sales Tool",   sub: 'Concept · SaaS / Sales · CRM built around the founder sales motion',          links: [{ label: 'View →', href: '#' }], itemRef: function(){ return caseStudies[0]; } },
    { rank: '05', type: 'case-study', name: 'Group Travel Planning Platform',                   sub: 'Concept · Consumer · Collaborative trip planning for friend groups',          links: [{ label: 'View →', href: '#' }], itemRef: function(){ return caseStudies[3]; } },
    { rank: '06', type: 'case-study', name: 'YouTube 2.0 — Fixing Long-Form Discovery',        sub: 'Concept · Consumer / Media · Rethinking recommendation for depth-seeking users', links: [{ label: 'View →', href: '#' }], itemRef: function(){ return caseStudies[2]; } },
    { rank: '07', type: 'personal',   name: 'Portfolio Website — This Site',                    sub: 'Live · Plain HTML/CSS/JS · 7-panel SPA with canvas and email gate',           links: [], itemRef: null },
    { rank: '08', type: 'personal',   name: 'GWS CLI — Google Workspace Terminal Tool',         sub: 'Open source · Dev tooling · CLI for managing GWS from terminal',              links: [{ label: 'GitHub →', href: '#' }], itemRef: null }
  ];

  function renderProjects() {
    var list = document.getElementById('projects-list');
    if (!list) return;
    list.innerHTML = allProjects.map(function (p, i) {
      var pillClass = p.type === 'case-study' ? 'project-pill--case-study' : 'project-pill--personal';
      var pillLabel = p.type === 'case-study' ? 'Case Study' : 'Personal';
      var linksHtml = p.links.map(function (l) {
        return '<a class="project-row__link" href="' + l.href + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + l.label + '</a>';
      }).join('');
      var clickable = p.itemRef ? ' data-idx="' + i + '"' : '';
      return '<div class="project-row"' + clickable + '>' +
        '<span class="project-row__num">' + p.rank + '</span>' +
        '<span class="project-pill ' + pillClass + '">' + pillLabel + '</span>' +
        '<div class="project-row__info">' +
          '<span class="project-row__name">' + p.name + '</span>' +
          '<span class="project-row__sub">' + p.sub + '</span>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">' + linksHtml + '</div>' +
        '</div>';
    }).join('');

    list.querySelectorAll('.project-row[data-idx]').forEach(function (row) {
      row.addEventListener('click', function () {
        var idx = parseInt(row.dataset.idx, 10);
        var p = allProjects[idx];
        if (p && p.itemRef) { openItemModal(p.itemRef()); }
      });
    });
  }

  /* ---- Work Panel Row Clicks ---- */
  function initWorkRows() {
    /* Work modals are placeholder content — no-op until modal data is mapped */
  }

  /* ---- Credentials Toggle ---- */
  function initCredentials() {
    var toggle = document.getElementById('cred-other-toggle');
    var list   = document.getElementById('cred-other-list');
    var link   = toggle ? toggle.querySelector('.cred-show-link') : null;
    if (toggle && list) {
      toggle.addEventListener('click', function () {
        var isOpen = list.style.display !== 'none';
        list.style.display = isOpen ? 'none' : 'block';
        if (link) link.textContent = isOpen ? 'Show ↓' : 'Hide ↑';
      });
    }
  }

  /* ---- How I Think Canvas ---- */
  function initHowIThinkCanvas() {
    var canvas = document.getElementById('skills-graph-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var rafId = null;

    var nodes = [
      { id: 'arch', label: 'Architecture',     x: 0.5,  y: 0.88, tier: 0 },
      { id: 'sys',  label: 'Systems Thinking', x: 0.25, y: 0.66, tier: 1 },
      { id: 'ux',   label: 'UX Research',      x: 0.75, y: 0.66, tier: 1 },
      { id: 'pm',   label: 'Product Strategy', x: 0.28, y: 0.42, tier: 2 },
      { id: 'data', label: 'Data Analysis',    x: 0.55, y: 0.42, tier: 2 },
      { id: 'eng',  label: 'Engineering',      x: 0.78, y: 0.42, tier: 2 },
      { id: 'ai',   label: 'AI / LLMs',        x: 0.5,  y: 0.12, tier: 3 }
    ];
    var edges = [
      ['arch','sys'],['arch','ux'],
      ['sys','pm'],['ux','data'],['sys','eng'],
      ['pm','ai'],['data','ai'],['eng','ai']
    ];
    var tierColors = { 0: '#56546e', 1: '#9896a0', 2: '#ece8e2', 3: '#c9a84c' };

    function draw() {
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      canvas.width  = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.clearRect(0, 0, w, h);

      edges.forEach(function (e) {
        var a = nodes.find(function(n){ return n.id === e[0]; });
        var b = nodes.find(function(n){ return n.id === e[1]; });
        ctx.beginPath();
        ctx.strokeStyle = '#2a2a38';
        ctx.lineWidth = 1;
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      });

      nodes.forEach(function (n) {
        var x = n.x * w;
        var y = n.y * h;
        var r = n.tier === 0 ? 8 : n.tier === 3 ? 7 : 5;
        var col = tierColors[n.tier];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.font = '400 11px "DM Sans", sans-serif';
        ctx.fillStyle = col;
        ctx.textAlign = 'center';
        ctx.textBaseline = n.tier === 0 ? 'top' : 'bottom';
        ctx.fillText(n.label, x, n.tier === 0 ? y + r + 5 : y - r - 5);
      });
    }

    document.addEventListener('panel:activate', function (e) {
      if (e.detail.panelId === 'panel-how-i-think') {
        requestAnimationFrame(draw);
      }
    });

    window.addEventListener('resize', function () {
      if (document.getElementById('panel-how-i-think').classList.contains('is-active')) {
        requestAnimationFrame(draw);
      }
    });
  }

  /* ---- Init ---- */
  renderProjects();
  initWorkRows();
  initCredentials();
  initHowIThinkCanvas();
  initStackDiagram();
  initContactCanvas();

})();
