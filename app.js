/* ============================================================
   app.js — Blueprint to Bits Portfolio
   Scroll nav · Experience accordion · Project modal · Active nav
   ============================================================ */

(function () {
  'use strict';

  /* ---- Scroll Nav ---- */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- Experience Accordion ---- */
  document.querySelectorAll('.exp-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = btn.closest('.exp-row');
      row.classList.toggle('is-open');
    });
  });

  /* ---- Active Nav Link (IntersectionObserver) ---- */
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  var sections = document.querySelectorAll(
    '#experience, #work, #case-studies, #skills, #credentials, #contact'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

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
    }
  ];

  var overlay   = document.getElementById('modal-overlay');
  var modalBody = document.getElementById('modal-body');
  var closeBtn  = document.getElementById('modal-close');

  function openModal(idx) {
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
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.proj-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(parseInt(card.dataset.proj, 10));
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(parseInt(card.dataset.proj, 10));
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

})();
