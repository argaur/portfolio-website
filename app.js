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
        { label: 'Problem', body: 'JindalX\'s recruitment team was screening hundreds of applications per week with a 3-person TA team. Resume review alone consumed 60% of recruiter time — mostly pattern-matching against a checklist that hadn\'t changed in 4 years.' },
        { label: 'Operational Reality', body: 'Recruiters were spending Tuesday and Wednesday of every week in pure screening mode. Interview slots were being offered to candidates who cleared the checklist but failed first-round anyway — a screening-to-interview conversion problem, not a headcount problem.' },
        { label: 'User Friction', body: 'Candidates received no communication between application and interview. Drop-off at the scheduling stage was 40% — candidates were being ghosted by a process that moved slower than their other offers.' },
        { label: 'Product Decision', body: 'Built an AI screening layer that ranked candidates by a multi-factor score (role-fit, trajectory, tenure-fit) derived from structured resume parsing plus historical hire quality data. Recruiters reviewed ranked batches, not raw inboxes.' },
        { label: 'AI / System Design', body: 'Structured data extraction from CVs via LLM → scoring model trained on 18 months of historical hire quality ratings → ranked queue with explainability (recruiters could see why each candidate scored as they did). Human-in-the-loop on all final hiring decisions.' },
        { label: 'Outcome', body: 'Time-to-hire reduced 50%. Screening-to-interview conversion improved 22%. TA team capacity freed by 35% — redirected to candidate experience and employer branding. Internal mobility increased 40% once the system was extended to open roles.' },
        { label: 'Tradeoffs', body: 'Opted against automated interview scheduling in v1 to avoid adding complexity to an already sensitive recruiter workflow. Accepted some scheduling overhead in exchange for recruiter trust in the system — adoption was 100% within 6 weeks.' }
      ]
    },
    {
      tag: 'AI · Performance',
      title: 'Performance Management Platform',
      detail: 'Replaced annual review cycles with continuous feedback loops. AI recommendation engine surfaces personalized development actions based on role, tenure, and past performance data. Single multi-tenant architecture deployed across 16 enterprise clients.',
      metrics: ['60% less manual review', '15 FTEs saved', '25% engagement↑'],
      narrative: [
        { label: 'Problem', body: 'Performance reviews at JindalX happened once per year, by calendar, regardless of what was actually happening on the floor. High performers and low performers received the same cadence of feedback. The review had no structural link to compensation, learning, or career development.' },
        { label: 'Operational Reality', body: 'Floor supervisors found annual reviews performative — they were writing summaries of things that had been resolved (or hadn\'t) months earlier. The review document had no downstream effect on anything the supervisor or employee actually cared about.' },
        { label: 'User Friction', body: 'The most common complaint from agents: "My manager doesn\'t know what I\'ve been doing." The annual form didn\'t capture the day-to-day — it captured whatever the supervisor remembered in the week they had to fill it in.' },
        { label: 'Product Decision', body: 'Replaced annual reviews with a continuous feedback loop: weekly check-in prompts for supervisors (3 structured questions, under 5 min), monthly performance summaries auto-generated from attendance, quality scores, and check-in history, and a bi-annual formal review that synthesized the record.' },
        { label: 'AI / System Design', body: 'AI generated the monthly summary from structured data — attendance, call quality scores, training completion, grievance history — with a natural language narrative the supervisor could review and edit. Eliminated the blank-page problem and ensured summaries were data-grounded.' },
        { label: 'Outcome', body: 'Supervisor time on performance documentation reduced 60% (narrative generation automated). Agent satisfaction with feedback process improved 34% (pulse survey). Formal review quality improved — reviewers arrived with 6 months of documented context rather than memory.' },
        { label: 'Tradeoffs', body: 'The automated summary required supervisors to trust AI-generated narratives they\'d attach their name to. Ran a 4-week pilot with 12 supervisors, incorporating their edit patterns to tune the generation. Final adoption: supervisors edited less than 20% of the generated text.' }
      ]
    },
    {
      tag: 'EdTech · AI',
      title: 'Knowledge & Learning Platform (Insight)',
      detail: 'Intelligent learning pathways adapt to agent performance data in real-time. Integrated chatbot handles 60% of queries without human escalation. Reduced onboarding time and improved frontline performance across 10,000+ seat operations.',
      metrics: ['45% performance↑', '35% training time↓', '60% faster resolution'],
      narrative: [
        { label: 'Problem', body: 'JindalX onboards 200+ BPO agents per month. The existing training was a 5-day classroom program with 40% retention at 30 days — measured by post-training assessments and floor supervisor feedback. It wasn\'t scaling.' },
        { label: 'Operational Reality', body: 'Training coordinators spent 60% of their time on scheduling logistics, not content quality. Agents across different delivery centers received inconsistent training based on which trainer was available. No data existed on which modules correlated with floor performance.' },
        { label: 'User Friction', body: 'Agents had to complete training in fixed classroom slots — often disrupting their first weeks on the floor. There was no way to revisit material after onboarding. Knowledge gaps that surfaced on the floor had no correction path.' },
        { label: 'Product Decision', body: 'Moved training to a modular, self-paced digital format with completion gating. Assessment-adaptive sequencing — agents who scored below threshold on a module were automatically routed to a remediation path before advancing.' },
        { label: 'AI / System Design', body: 'Content recommendation engine suggested supplementary modules based on floor performance data (error rates, supervisor flags). Post-90-day floor performance correlated back to training completion patterns to identify which modules were predictive — these were elevated in the standard path.' },
        { label: 'Outcome', body: '30-day retention improved from 40% to 67%. Time-to-productivity for new agents fell by 35%. Training logistics overhead reduced 45% (from 3 coordinators to 2). Floor supervisors reported measurably fewer first-month errors.' },
        { label: 'Tradeoffs', body: 'Chose to build on an existing LMS platform rather than a custom build, sacrificing some UX quality for a 6-week deployment timeline. Accepted this debt — the content and sequencing logic were the real value, not the platform.' }
      ]
    },
    {
      tag: 'B2B · CRM',
      title: 'B2B CRM & Auction Platform (AuctionIT)',
      detail: 'Full auction lifecycle management from listing through settlement. Automated invoicing eliminated manual reconciliation entirely. The UX redesign drove the 30% transaction volume increase.',
      metrics: ['30% transactions↑', 'Auto-invoicing', 'CRM integration'],
      narrative: [
        { label: 'Problem', body: 'JindalX\'s B2B procurement arm was running auctions through a combination of spreadsheets, email threads, and phone calls. There was no single source of truth for bid history, settlement status, or client relationships.' },
        { label: 'Operational Reality', body: 'Finance teams spent 2 days per week on manual invoice reconciliation. Auction outcomes were stored in email threads — no searchability, no audit trail, no client visibility into their own bid history.' },
        { label: 'User Friction', body: 'Enterprise clients (buyers) had no self-serve access to their auction history or settlement status. Every question required a phone call to the sales team, creating support overhead and slowing deal velocity.' },
        { label: 'Product Decision', body: 'Built a unified platform covering full auction lifecycle — listing, bidding, settlement, invoicing — with a client portal for self-serve visibility. CRM layer tracked all client interactions and relationship context.' },
        { label: 'AI / System Design', body: 'Automated invoicing via rule-based engine triggered on auction close. Settlement status tracked via state machine. Client portal surfaced real-time bid history, settlement status, and transaction documents without human intervention.' },
        { label: 'Outcome', body: 'Transaction volume increased 30% in first quarter post-launch. Invoice reconciliation time eliminated entirely. Client support calls for status queries reduced 65%. Sales team redirected from support to new business development.' },
        { label: 'Tradeoffs', body: 'Chose to build self-serve portal before CRM integration, which meant the first 6 weeks required manual data sync between the two systems. Accepted this overhead to get client-facing value shipped faster — the self-serve feature was the deal-winner in sales conversations.' }
      ]
    },
    {
      tag: 'HRMS · Automation',
      title: 'HR Management System (Touchpoint HRMS)',
      detail: 'Handles shift workers, floating assignments, and multi-state compliance challenges unique to BPO operations. Full RESTful API integration with ERP backbone.',
      metrics: ['5,000+ agents', '25% satisfaction↑', 'Full ERP integration'],
      narrative: [
        { label: 'Problem', body: 'JindalX\'s legacy HR operation ran on 12 disconnected tools — payroll in one system, compliance in another, workforce planning in a spreadsheet. Every reporting cycle required 3 days of manual consolidation by analysts who should have been doing strategic work.' },
        { label: 'Operational Reality', body: 'Middle managers were spending 40% of their time on administrative coordination. The data to answer their questions existed — it just couldn\'t talk to itself. This was an integration problem masquerading as a tooling problem.' },
        { label: 'User Friction', body: 'HR teams had to export-copy-paste across 5 systems to answer a single workforce query. BPO floor managers didn\'t know their team\'s actual capacity until the shift had already started.' },
        { label: 'Product Decision', body: 'Rather than replacing systems (politically risky, 18-month timeline), we built an intelligence layer that unified data across existing tools via APIs. A single command-center surface — no migration, no retraining on new platforms.' },
        { label: 'AI / System Design', body: 'Compliance anomaly detection flagged payroll irregularities before submission. Shift-optimization engine surfaced capacity recommendations to floor managers 2 hours before shift start. Natural language query layer answered workforce questions without analyst involvement.' },
        { label: 'Outcome', body: '15 FTE equivalents recaptured from manual coordination. Payroll error rate dropped 73%. Compliance reporting time fell from 3 days to 4 hours. Employee satisfaction improved 25%. Adopted by 8 BPO delivery centers in 3 months.' },
        { label: 'Tradeoffs', body: 'Integration over replacement was slower to build but avoided the political risk of forcing a platform switch on 5,000+ employee records. Accepted reduced intelligence quality (working from exports vs. live data) in exchange for 6-month deployment over 18.' }
      ]
    },
    {
      tag: 'Analytics · BI',
      title: 'Business Intelligence Platform (Jx Data Cloud)',
      detail: 'Replaced 7 siloed spreadsheet-based reports with a single real-time warehouse. Automated ETL pipelines reduced data engineering toil by 35%.',
      metrics: ['40% accuracy↑', '35% processing↓', 'Multi-source ETL'],
      narrative: [
        { label: 'Problem', body: 'JindalX leadership had workforce data but no workforce intelligence. Attrition was analyzed quarterly in a slide deck. Performance patterns were invisible in real-time. Decisions about headcount and team structure were made on instinct.' },
        { label: 'Operational Reality', body: 'Delivery center managers were running their teams on gut feel and experience. The data to make better decisions existed in payroll, attendance, performance, and grievance systems — but required a data analyst 3 days to pull and format.' },
        { label: 'User Friction', body: 'Decisions lagged reality by 2-3 weeks. A spike in attrition in one delivery center wouldn\'t surface in any report until the quarter-end review — by which time 40+ people had already left.' },
        { label: 'Product Decision', body: 'Built a real-time workforce dashboard that surfaced 12 leading indicators across 8 delivery centers. Designed for delivery center managers, not analysts — every metric had a recommended action state, not just a number.' },
        { label: 'AI / System Design', body: 'Attrition risk scoring model trained on 24 months of exit data flagged individuals at elevated risk 4-6 weeks before predicted departure. Scores surfaced as a ranked list (High/Medium/Low), not a raw probability — managers could act without understanding the model.' },
        { label: 'Outcome', body: 'Early-warning attrition model achieved 74% accuracy at 4-week prediction horizon. Two delivery centers reduced voluntary attrition 18% in Q1 using the proactive intervention playbook. Dashboard adopted by all 8 delivery centers within 60 days. Reporting accuracy improved 40%.' },
        { label: 'Tradeoffs', body: 'Chose to display risk as a relative rank rather than a percentage — early testing showed managers over-indexing on raw probabilities and acting on employees who weren\'t actually at risk. The abstraction reduced false positives at the cost of precision.' }
      ]
    },
    {
      tag: 'Platform · EdTech',
      title: 'Passport & PassportOS — OneValley',
      detail: 'Led product strategy and roadmap for B2C and B2B entrepreneurship platforms supporting global programs including Entrepreneurship World Cup. Served universities, banks, accelerators, and corporate incubators across India and international markets. Drove feature development, KPI frameworks, mentorship systems, and SaaS ecosystem integration.',
      metrics: ['B2B + B2C product lines', 'Global multi-client SaaS', 'Startup ecosystem platform'],
      narrative: [
        { label: 'Problem', body: 'OneValley\'s Passport platform was serving two radically different audiences — startup founders (B2C) and institutional partners like universities and accelerators (B2B) — on the same product surface. The result was feature sprawl: every stakeholder was asking for something different, and the roadmap had no clear north star.' },
        { label: 'Operational Reality', body: 'Program managers at partner institutions were manually tracking founder progress through spreadsheets. Mentorship sessions were booked via email. Impact reporting to corporate sponsors required 2–3 hours of manual data aggregation per quarter — a recurring cost that scaled badly as the partner count grew.' },
        { label: 'User Friction', body: 'Founders (B2C users) experienced the platform as a directory, not a tool. Discovery of mentors, resources, and peer connections required too many steps. Retention dropped sharply after onboarding — the platform captured signups from programs like Entrepreneurship World Cup but failed to convert them into engaged long-term users.' },
        { label: 'Product Decision', body: 'Separated the product into two distinct surfaces: Passport (founder-facing) focused on discovery, connections, and program participation; PassportOS (institution-facing) focused on cohort management, mentor matching, and automated impact reporting. Shared data layer, divergent UX contracts.' },
        { label: 'What I Built', body: 'Led roadmap strategy across both product lines — KPI frameworks, feature prioritization, mentorship system design, SaaS integration with partner ecosystems. Coordinated across engineering, design, and partner success teams to align quarterly releases with global program cycles including Entrepreneurship World Cup timelines. [VERIFY: team size, specific release cadence]' },
        { label: 'Outcome', body: 'B2B partners moved from manual reporting to automated impact dashboards, recovering hours per quarter per program manager. Founder engagement with mentorship and peer features improved post-separation. Platform supported global programs across India and international markets simultaneously. [VERIFY: specific engagement metrics, partner count]' }
      ]
    },
    {
      tag: 'Content · Platform',
      title: 'Digital Content & Publishing Platform — Taccomacco',
      detail: 'As Co-Founder & COO, built the content pipeline and publishing infrastructure from scratch. Designed version control workflows, creator onboarding, and multi-channel distribution. Ran a structured incubation program that helped 6+ creators go from idea to published digital titles.',
      metrics: ['500+ digital titles launched', '6 creators incubated', 'Full content pipeline built'],
      narrative: [
        { label: 'Problem', body: 'Digital content creators — particularly in non-English markets — had no structured path from idea to distributed digital product. Existing platforms (Gumroad, Notion) gave creators a publishing endpoint but no production infrastructure: no editorial workflow, no version control, no channel strategy. The gap between "I want to create" and "I have a launched product" was entirely unaddressed.' },
        { label: 'Operational Reality', body: 'Early creator partners were producing content across disconnected tools — Google Docs for writing, Canva for design, WhatsApp for feedback loops. There was no single system of record, no structured review stage, and no repeatable process for moving a title from draft to launch. Each title was an ad-hoc project.' },
        { label: 'User Friction', body: 'Creators experienced the biggest drop-off between "content drafted" and "content published." The friction was structural: packaging, pricing, distribution channel selection, and post-launch marketing were each a separate rabbit hole. Most creators had creative capacity but no operational bandwidth to navigate all of it.' },
        { label: 'Product Decision', body: 'Built a structured incubation model — a 6-stage pipeline (Ideation → Outline → Draft → Review → Package → Launch) with defined handoffs at each stage. Platform tooling codified the pipeline: version-controlled drafts, templated packaging, integrated multi-channel distribution. Creators focused on content; the platform handled the operations layer.' },
        { label: 'What I Built', body: 'As Co-Founder & COO: designed the full content pipeline, version control workflow, creator onboarding program, and multi-channel distribution infrastructure from scratch. Ran incubation cohorts — selecting, briefing, and shipping titles with 6 creators from ideation to launch. Managed publishing operations, partner relationships, and platform roadmap. [VERIFY: tech stack, distribution channels used]' },
        { label: 'Outcome', body: '500+ digital titles launched across the platform. 6 creators taken through the full incubation cycle — from raw idea to published, distributed digital product. Full content pipeline operational and repeatable. [VERIFY: revenue, creator satisfaction metrics, timeline]' }
      ]
    },
    {
      tag: 'Architecture · PM',
      title: 'Architectural Projects Portfolio — RSP Design Consultants',
      detail: 'Managed 40+ architectural and interior design projects across IT campuses, healthcare facilities, and institutional buildings. Introduced project management best practices that reduced delivery time by 25% and maintained a 95% client retention rate across a 3-year tenure.',
      metrics: ['40+ projects delivered', '95% client retention', '25% faster delivery'],
      narrative: [
        { label: 'Problem', body: 'RSP Design Consultants was managing a growing portfolio of complex multi-stakeholder projects — IT campuses, healthcare facilities, institutional buildings — without a structured project management framework. Projects ran on informal milestone tracking, and delivery timelines slipped routinely due to coordination gaps between design, client review, and contractor execution phases.' },
        { label: 'Operational Reality', body: 'Design and delivery were treated as sequential phases, not parallel workstreams. Client feedback cycles were unstructured — revisions arrived at unpredictable times, causing cascading delays downstream. Contractors received finalized drawings without staged visibility into evolving design decisions, leading to late-stage rework. [VERIFY: typical project scale, team structure]' },
        { label: 'User Friction', body: 'Clients experienced the process as opaque — long silences between submissions, surprise scope conversations, and revision cycles that felt reactive rather than managed. Internal teams operated under deadline pressure that was largely self-inflicted by the absence of a structured review cadence.' },
        { label: 'Product Decision', body: 'Introduced phased project management: structured milestone gates, client review windows built into the schedule rather than triggered ad-hoc, and contractor engagement beginning at design development (not just construction documentation). Applied PM frameworks from software product development — sprint cycles, documented decision logs, structured sign-offs — to an architectural delivery context.' },
        { label: 'What I Built', body: 'Managed 40+ projects across IT campuses, healthcare, and institutional typologies over a 3-year tenure. Introduced delivery frameworks that formalized the design-review-construction handoff. Built client communication cadences and internal milestone tracking that gave both teams and clients predictable, structured touchpoints. [VERIFY: specific tools used, team size managed]' },
        { label: 'Outcome', body: 'Delivery time reduced 25% across managed projects through elimination of unstructured revision cycles and earlier contractor coordination. 95% client retention rate maintained across the tenure — a signal of both delivery reliability and client communication quality. Built the operational foundation that informed how I approach product management: clear phases, structured handoffs, and proactive stakeholder communication. [VERIFY: specific project examples you can name]' }
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
