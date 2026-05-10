// Gaurav Gupta Portfolio — "Blueprint to Bits"
// All sections: Nav, Hero, Experience, Projects, Case Studies, Skills, Credentials, Footer

const { useState, useEffect, useRef } = React;

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const T = {
  navy:    '#0b1628',
  navyMid: '#112240',
  cream:   '#f7f3ee',
  white:   '#ffffff',
  text:    '#1c1917',
  muted:   '#6b6560',
  border:  '#e2dbd3',
  terra:   '#bf5c3a',
  blue:    '#2d5da1',
  forest:  '#3d5c3a',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: "JindalX",
    role: "Sr. PM – Digital Transformation",
    period: "Jun 2022 – May 2025",
    duration: "3 yrs",
    type: "tech",
    bullets: [
      "Built 6 enterprise products 0→1 for 5,000+ users across HR, EdTech, and BI",
      "Led AI integration into ATS, performance management, and knowledge platforms",
      "Managed cross-functional squads across product, engineering, design, and data"
    ]
  },
  {
    company: "OneValley",
    role: "Product Manager",
    period: "Sep 2020 – Jul 2022",
    duration: "1y 10m",
    type: "tech",
    bullets: [
      "Product strategy and roadmap for a global startup ecosystem platform",
      "Drove feature development aligned with investor and founder personas"
    ]
  },
  {
    company: "Taccomacco",
    role: "Co-Founder & COO",
    period: "Jul 2017 – Sep 2020",
    duration: "3y 2m",
    type: "pivot",
    bullets: [
      "Co-founded a design-meets-technology venture — the bridge between worlds",
      "Managed full operations, client relationships, and product direction",
      "Translated physical design thinking into digital product strategy"
    ]
  },
  {
    company: "RSP Design Consultants",
    role: "Design Manager (Architecture)",
    period: "Sep 2014 – Jun 2017",
    duration: "2y 9m",
    type: "arch",
    bullets: [
      "Led design and delivery of large-scale architectural projects",
      "Managed multi-disciplinary teams and contractor coordination",
      "Built the foundation: systems thinking, spatial logic, UX at scale"
    ]
  }
];

const typeColors = { tech: T.blue, pivot: T.terra, arch: T.forest };
const typeLabels = { tech: "Product & Tech", pivot: "Founder / Pivot", arch: "Architecture" };

const PROJECTS = [
  {
    id: 1, title: "AI-Powered Talent Management Suite",
    category: "AI · HR Tech",
    metrics: ["50% faster hiring", "200+ hiring managers", "40% internal mobility↑"],
    desc: "Comprehensive ATS built from scratch with embedded AI workflows — automated screening and GenAI-driven job matching.",
    detail: "Designed and shipped a full ATS with AI-powered screening, job description generation, and candidate-role matching. Integrated with existing HRMS for seamless data flow across the talent lifecycle. Deployed for 200+ hiring managers across 16 enterprise clients."
  },
  {
    id: 2, title: "Performance Management Platform",
    category: "AI · Performance",
    metrics: ["60% less manual review", "15 FTEs saved", "25% engagement↑"],
    desc: "Evaluation system for 5,000+ employees across 16 clients. AI-driven recommendation engine for personalized development plans.",
    detail: "Replaced annual review cycles with continuous feedback loops. AI recommendation engine surfaces personalized development actions based on role, tenure, and past performance data. Single multi-tenant architecture deployed across 16 enterprise clients."
  },
  {
    id: 3, title: "Knowledge & Learning Platform (Insight)",
    category: "EdTech · AI",
    metrics: ["45% performance↑", "35% training time↓", "60% faster resolution"],
    desc: "AI-powered EdTech system for BPO agents with integrated chatbot for instant query resolution and intelligent learning paths.",
    detail: "Intelligent learning pathways adapt to agent performance data in real-time. Integrated chatbot handles 60% of queries without human escalation. Reduced onboarding time and improved frontline performance across 10,000+ seat operations."
  },
  {
    id: 4, title: "B2B CRM & Auction Platform (AuctionIT)",
    category: "B2B · CRM",
    metrics: ["30% transactions↑", "Auto-invoicing", "CRM integration"],
    desc: "End-to-end B2B CRM with integrated auction management, automated bidding workflows, and invoice generation.",
    detail: "Full auction lifecycle management from listing through settlement. Automated invoicing eliminated manual reconciliation entirely. The UX redesign — grounded in buyer journey research — drove the 30% transaction volume increase."
  },
  {
    id: 5, title: "HR Management System (Touchpoint HRMS)",
    category: "HRMS · Automation",
    metrics: ["5,000+ agents", "25% satisfaction↑", "Full ERP integration"],
    desc: "Purpose-built HRMS for floating BPO agents — payroll, leave management, and compliance with full ERP integration.",
    detail: "Handles shift workers, floating assignments, and multi-state compliance challenges unique to BPO operations. Full RESTful API integration with ERP backbone. Reduced HR overhead and improved satisfaction scores across the workforce."
  },
  {
    id: 6, title: "Business Intelligence Platform (Jx Data Cloud)",
    category: "Analytics · BI",
    metrics: ["40% accuracy↑", "35% processing↓", "Multi-source ETL"],
    desc: "Centralized data warehouse consolidating 7 operational sources. Real-time Power BI and Looker Studio dashboards with automated ETL.",
    detail: "Replaced 7 siloed spreadsheet-based reports with a single real-time warehouse. Automated ETL pipelines reduced data engineering toil by 35%. Power BI and Looker Studio dashboards serve executives and ops teams alike."
  }
];

const CASE_STUDIES = [
  {
    id: 1,
    title: "Founder's CRM — Conversation-First Sales Tool",
    category: "B2B SaaS · AI · Telegram Bot",
    problem: "60–70% of founders abandon CRM within 4 weeks.",
    insight: "WhatsApp forwards, voice notes, and screenshots become structured deal data — no manual logging.",
    stats: ["39-page PRD", "16 tools analysed", "10 founder interviews"]
  },
  {
    id: 2,
    title: "Peak-Hour Decision Support for Blinkit Dark Stores",
    category: "Quick Commerce · Operations",
    problem: "Managers discover picker issues 3–7 minutes too late during the 6–10 PM peak window.",
    insight: "After SLA has already been breached. Real-time decision support changes the intervention window entirely.",
    stats: ["Working prototype", "3 research methods", "Unit economics modelled"]
  },
  {
    id: 3,
    title: "YouTube 2.0 — Fixing Long-Form Discovery",
    category: "Consumer Platform · Algorithm",
    problem: "47% of users manually search every session. 29% of Gen Z sessions end without watching anything.",
    insight: "The home feed buries long-form, not users. Redesigning for intent-based discovery.",
    stats: ["171 survey responses", "4 product solutions", "27+ sources"]
  },
  {
    id: 4,
    title: "Group Travel Planning Platform",
    category: "Consumer App · AI",
    problem: "1–2 people absorb 80%+ of planning load in a $168.7B market.",
    insight: "Budget and dietary misalignments surface mid-trip as conflict. They should surface pre-trip as input.",
    stats: ["6 user interviews", "$168.7B market", "Full PRD"]
  },
  {
    id: 5,
    title: "Vitae — Health Records, Finally Understood",
    category: "Health Tech · AI · PWA",
    problem: "Indian families manage health via blurry WhatsApp prescription photos. ₹6,000+ crore lost to repeat tests.",
    insight: "Gemma 4 26B OCR + Claude turns photos into plain-language health records. Live product shipped in 10 days.",
    stats: ["Live product", "6-person team", "10 days shipped"]
  }
];

const SKILLS = [
  { cat: "Product Management", items: ["Product Lifecycle Mgmt", "Go-to-Market Strategy", "Roadmap Development", "Feature Prioritization", "Product-Market Fit", "UX Design", "Agile / Scrum / Kanban", "Stakeholder Management"] },
  { cat: "AI & Automation", items: ["AI Strategy & Implementation", "Generative AI Integration", "Autonomous Automation", "MLOps", "AI Agent Development", "Workflow Optimization"] },
  { cat: "Analytics & Data", items: ["SQL", "Power BI", "Looker Studio", "Tableau", "Google Analytics", "Python", "Excel (Advanced)"] },
  { cat: "No-Code / Low-Code", items: ["Airtable (Advanced)", "Zapier", "Power Automate", "Make.com", "n8n", "Automation Anywhere"] },
  { cat: "Product Tools", items: ["Jira", "Figma", "Confluence", "Miro", "Balsamiq", "Lucidchart"] },
  { cat: "Dev & Integration", items: ["API Integration", "RESTful Services", "Microservices", "HTML / CSS / JS", "JSON / XML"] }
];

const CERTS = [
  { name: "Certified Scrum Master (CSM)", issuer: "Scrum Alliance", year: "2025" },
  { name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", year: "2025" },
  { name: "Product Management Professional Certificate", issuer: "LinkedIn Learning", year: "" },
  { name: "Essentials Automation", issuer: "Automation Anywhere", year: "2024" },
  { name: "SQL for Data Analytics", issuer: "Udemy", year: "" },
  { name: "Applied Data Science with Python", issuer: "IBM", year: "" },
  { name: "Google Analytics Certified", issuer: "Google", year: "" },
];

// ─── SHARED ──────────────────────────────────────────────────────────────────

function SectionLabel({ number, title, dark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
      <div style={{ width: '40px', height: '1px', background: T.terra, flexShrink: 0 }}></div>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', letterSpacing: '0.16em', color: T.terra, fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {String(number).padStart(2,'0')} — {title}
      </span>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(255,255,255,0.08)' : T.border }}></div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ scrolled }) {
  const links = [
    ['Experience', '#experience'],
    ['Work', '#work'],
    ['Case Studies', '#case-studies'],
    ['Skills', '#skills'],
    ['Credentials', '#credentials'],
  ];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '64px', padding: '0 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(11,22,40,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'background 0.35s ease, border-color 0.35s ease',
    }}>
      <a href="#home" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 700, color: T.white, textDecoration: 'none', letterSpacing: '0.02em' }}>GG</a>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {links.map(([label, href]) => (
          <a key={label} href={href}
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = T.white}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          >{label}</a>
        ))}
        <a href="mailto:ar.gaurav20@gmail.com"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.navy, background: T.white, padding: '8px 20px', textDecoration: 'none', transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Contact</a>
      </div>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" data-screen-label="Hero" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: T.navy,
      backgroundImage: `
        linear-gradient(rgba(65,120,220,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(65,120,220,0.07) 1px, transparent 1px),
        linear-gradient(rgba(65,120,220,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(65,120,220,0.025) 1px, transparent 1px)`,
      backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '120px 48px 100px',
    }}>
      {/* Coordinate label */}
      <div style={{ position: 'absolute', top: '88px', left: '48px', fontFamily: 'DM Sans', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.14em' }}>
        26.9124° N · 75.7873° E · JAIPUR
      </div>
      <div style={{ position: 'absolute', top: '88px', right: '48px', fontFamily: 'DM Sans', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.14em', textAlign: 'right' }}>
        PORTFOLIO · 2025
      </div>

      {/* Arc tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '44px' }}>
        <div style={{ width: '32px', height: '1px', background: T.terra }}></div>
        <span style={{ fontFamily: 'DM Sans', fontSize: '11px', letterSpacing: '0.18em', color: T.terra, fontWeight: 600, textTransform: 'uppercase' }}>
          Senior Product Manager · AI Strategist
        </span>
      </div>

      {/* Main name */}
      <div style={{ maxWidth: '960px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(72px, 9vw, 120px)', fontWeight: 600, color: T.white, lineHeight: 0.92, margin: '0 0 48px', letterSpacing: '-0.01em' }}>
          Gaurav<br />
          <span style={{ color: 'rgba(255,255,255,0.32)' }}>Gupta.</span>
        </h1>

        {/* Statement */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '860px', marginBottom: '64px' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, margin: 0 }}>
            "Trained as an architect — five years learning how space, systems, and people work together. Now applying the same thinking to digital products."
          </p>
          <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.8, margin: 0 }}>
            B.Arch from NIT Jaipur. 10 years building — first in steel and concrete, now in data and interfaces. Currently shipping AI-powered enterprise tools that real people use every day.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#work" style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.navy, background: T.white, padding: '14px 36px', textDecoration: 'none' }}>View Work</a>
          <a href="mailto:ar.gaurav20@gmail.com" style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px', letterSpacing: '0.02em' }}>
            Get in touch →
          </a>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div style={{ position: 'absolute', bottom: '40px', left: '48px', right: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
        <div style={{ display: 'flex', gap: '48px' }}>
          {[['10', 'Years Experience'], ['6', 'Products Shipped'], ['5K+', 'Users Served']].map(([n, l]) => (
            <div key={n}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="https://linkedin.com/in/ar-gaurav" target="_blank" style={{ fontFamily: 'DM Sans', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          >LinkedIn</a>
          <a href="mailto:ar.gaurav20@gmail.com" style={{ fontFamily: 'DM Sans', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          >Email</a>
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" data-screen-label="Experience" style={{ background: T.cream, padding: '120px 48px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <SectionLabel number={1} title="Work Experience" />

        {/* Arc bar — visual career narrative */}
        <div style={{ marginBottom: '72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
            <div title="Architecture" style={{ flex: 2.75, height: '100%', background: T.forest }}></div>
            <div title="Pivot" style={{ flex: 3.2, height: '100%', background: T.terra }}></div>
            <div title="Product & Tech" style={{ flex: 4.8, height: '100%', background: T.blue }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'DM Sans', fontSize: '10px', color: T.forest, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Architecture · 2014</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: '10px', color: T.terra, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Founding · 2017</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: '10px', color: T.blue, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Product & AI · 2025</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EXPERIENCE.map((exp, i) => (
            <ExperienceRow key={i} exp={exp} i={i} total={EXPERIENCE.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceRow({ exp, i, total }) {
  const [open, setOpen] = useState(false);
  const col = typeColors[exp.type];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 24px 1fr', gap: '0 28px', paddingBottom: i < total - 1 ? '48px' : 0 }}>
      {/* Left */}
      <div style={{ textAlign: 'right', paddingTop: '2px' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: T.muted, letterSpacing: '0.04em', marginBottom: '10px' }}>{exp.period}</div>
        <span style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: col, background: col + '18', padding: '3px 9px', borderRadius: '2px' }}>{typeLabels[exp.type]}</span>
      </div>
      {/* Timeline spine */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col, border: `2px solid ${T.cream}`, boxShadow: `0 0 0 1.5px ${col}`, flexShrink: 0, zIndex: 1, marginTop: '2px' }}></div>
        {i < total - 1 && <div style={{ flex: 1, width: '1px', background: `linear-gradient(${col}40, ${typeColors[EXPERIENCE[i+1].type]}30)`, marginTop: '6px' }}></div>}
      </div>
      {/* Content */}
      <div style={{ paddingBottom: i < total - 1 ? '8px' : 0 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', fontWeight: 600, color: T.text, margin: '0 0 16px', lineHeight: 1.3 }}>{exp.company}</h3>
            <span style={{ fontFamily: 'DM Sans', fontSize: '18px', color: T.muted, transition: 'transform 0.25s', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'none', marginTop: '4px' }}>+</span>
          </div>
          <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: T.muted, marginBottom: '0', letterSpacing: '0.02em' }}>{exp.role} · {exp.duration}</div>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: open ? '200px' : '0', transition: 'max-height 0.35s ease', marginTop: open ? '20px' : '0' }}>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exp.bullets.map((b, j) => (
              <li key={j} style={{ fontFamily: 'DM Sans', fontSize: '13px', color: T.text, lineHeight: 1.65, opacity: 0.78 }}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function ProjectCard({ project, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(project)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.white, border: `1px solid ${hov ? T.blue+'44' : T.border}`,
        padding: '32px', cursor: 'pointer',
        transition: 'all 0.25s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 16px 48px rgba(45,93,161,0.1)' : 'none',
      }}>
      <div style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: T.terra, textTransform: 'uppercase', marginBottom: '14px' }}>{project.category}</div>
      <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '21px', fontWeight: 600, color: T.text, margin: '0 0 14px', lineHeight: 1.25 }}>{project.title}</h3>
      <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: T.muted, lineHeight: 1.65, margin: '0 0 24px' }}>{project.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {project.metrics.map((m, i) => (
          <span key={i} style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, color: T.blue, background: T.blue+'12', padding: '4px 10px', letterSpacing: '0.02em' }}>{m}</span>
        ))}
      </div>
      <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: T.blue, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', letterSpacing: '0.04em' }}>View details →</div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,22,40,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div style={{ background: T.white, maxWidth: '620px', width: '90%', padding: '56px', position: 'relative' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '22px', color: T.muted, lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: T.terra, textTransform: 'uppercase', marginBottom: '14px' }}>{project.category}</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 600, color: T.text, margin: '0 0 24px', lineHeight: 1.2 }}>{project.title}</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: T.text, lineHeight: 1.75, margin: '0 0 32px', opacity: 0.8 }}>{project.detail}</p>
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {project.metrics.map((m, i) => (
            <span key={i} style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 700, color: T.blue, background: T.blue+'12', padding: '6px 14px' }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="work" data-screen-label="Projects" style={{ background: T.white, padding: '120px 48px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <SectionLabel number={2} title="Featured Projects" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', fontWeight: 600, color: T.text, margin: '0 0 8px' }}>Built at JindalX</h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: T.muted, margin: 0 }}>Enterprise tools shipped for real users. Measurable outcomes.</p>
          </div>
          <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: T.muted }}>Click any card for details</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', background: T.border }}>
          {PROJECTS.map(p => <ProjectCard key={p.id} project={p} onClick={setActive} />)}
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

// ─── CASE STUDIES ──────────────────────────────────────────────────────────────

function CaseStudyRow({ cs, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.navy : T.white,
        padding: '36px 48px',
        display: 'grid', gridTemplateColumns: '48px 1fr auto',
        gap: '32px', alignItems: 'center',
        transition: 'background 0.3s ease', cursor: 'pointer',
        borderBottom: `1px solid ${T.border}`,
      }}>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 300, color: hov ? 'rgba(255,255,255,0.15)' : T.border, lineHeight: 1 }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div>
        <div style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: T.terra, textTransform: 'uppercase', marginBottom: '8px' }}>{cs.category}</div>
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: hov ? T.white : T.text, margin: '0 0 8px', lineHeight: 1.2, transition: 'color 0.3s' }}>{cs.title}</h3>
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: hov ? 'rgba(255,255,255,0.45)' : T.muted, margin: 0, lineHeight: 1.55, transition: 'color 0.3s' }}>{cs.problem} {cs.insight}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', minWidth: '160px' }}>
        {cs.stats.map((s, i) => (
          <span key={i} style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, color: hov ? 'rgba(255,255,255,0.6)' : T.blue, letterSpacing: '0.02em', transition: 'color 0.3s' }}>{s}</span>
        ))}
        <div style={{ fontFamily: 'DM Sans', fontSize: '18px', color: hov ? T.white : T.border, marginTop: '8px', transition: 'all 0.25s', transform: hov ? 'translateX(6px)' : 'none' }}>→</div>
      </div>
    </div>
  );
}

function CaseStudies() {
  return (
    <section id="case-studies" data-screen-label="Case Studies" style={{ background: T.cream, padding: '120px 48px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <SectionLabel number={3} title="Case Studies" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', fontWeight: 600, color: T.text, margin: '0 0 8px' }}>Deep Dives</h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: T.muted, margin: 0 }}>End-to-end product thinking — problem discovery through execution.</p>
          </div>
        </div>
        <div style={{ border: `1px solid ${T.border}` }}>
          {CASE_STUDIES.map((cs, i) => <CaseStudyRow key={cs.id} cs={cs} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

function Skills() {
  return (
    <section id="skills" data-screen-label="Skills" style={{
      background: T.navy, padding: '120px 48px',
      backgroundImage: `linear-gradient(rgba(65,120,220,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(65,120,220,0.05) 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
    }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <SectionLabel number={4} title="Skills & Tools" dark />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '56px 80px' }}>
          {SKILLS.map((s, i) => (
            <div key={i}>
              <h4 style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', color: T.terra, textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{s.cat}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {s.items.map((item, j) => (
                  <span key={j} style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.4 }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CREDENTIALS ──────────────────────────────────────────────────────────────

function Credentials() {
  return (
    <section id="credentials" data-screen-label="Credentials" style={{ background: T.white, padding: '120px 48px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <SectionLabel number={5} title="Education & Credentials" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: T.border }}>
          {/* Education */}
          <div style={{ background: T.navy, padding: '56px' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: T.terra, textTransform: 'uppercase', marginBottom: '24px' }}>Foundation</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: T.white, margin: '0 0 8px', lineHeight: 1.15 }}>Bachelor of Architecture</h3>
            <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', letterSpacing: '0.02em' }}>National Institute of Technology (NIT), Jaipur · 2009–2014</p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
              Five years learning how to think about space, systems, and the people who inhabit them — the same mental model, now applied to products.
            </p>
          </div>
          {/* Certs */}
          <div style={{ background: T.cream, padding: '56px' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: T.terra, textTransform: 'uppercase', marginBottom: '24px' }}>Certifications</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {CERTS.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: `1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '2px' }}>{c.name}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: T.muted }}>{c.issuer}</div>
                  </div>
                  {c.year && <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: T.muted, flexShrink: 0, marginLeft: '16px' }}>{c.year}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer data-screen-label="Footer" style={{
      background: T.navyMid, padding: '120px 48px 64px',
      backgroundImage: `linear-gradient(rgba(65,120,220,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(65,120,220,0.05) 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <SectionLabel number={6} title="Contact" dark />
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 600, color: T.white, margin: '0 0 24px', lineHeight: 1.05 }}>
          Have a product<br />challenge to solve?
        </h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: '15px', color: 'rgba(255,255,255,0.38)', maxWidth: '440px', lineHeight: 1.75, margin: '0 0 56px' }}>
          Whether it's an AI idea, a product strategy question, or you're looking for a senior PM — I'm listening.
        </p>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:ar.gaurav20@gmail.com"
            style={{ fontFamily: 'DM Sans', fontSize: '16px', fontWeight: 600, color: T.white, textDecoration: 'none', borderBottom: `1px solid ${T.terra}`, paddingBottom: '4px' }}>
            ar.gaurav20@gmail.com
          </a>
          <a href="https://linkedin.com/in/ar-gaurav" target="_blank"
            style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', letterSpacing: '0.04em' }}>
            linkedin.com/in/ar-gaurav →
          </a>
        </div>

        <div style={{ marginTop: '112px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>GG</div>
          <div style={{ fontFamily: 'DM Sans', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Gaurav Gupta · Jaipur · 2025</div>
        </div>
      </div>
    </footer>
  );
}

// ─── TWEAKS WRAPPER ───────────────────────────────────────────────────────────

function PortfolioTweaks() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const style = document.getElementById('tweak-styles') || (() => {
      const s = document.createElement('style');
      s.id = 'tweak-styles';
      document.head.appendChild(s);
      return s;
    })();
    style.textContent = `
      :root { --terra: ${tweaks.accentColor}; }
    `;
  }, [tweaks.accentColor]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Brand Accent">
        <TweakColor id="accentColor" label="Accent color" value={tweaks.accentColor} onChange={v => setTweak('accentColor', v)} />
      </TweakSection>
      <TweakSection title="Hero Style">
        <TweakRadio id="heroTone" label="Background" options={['Blueprint Navy', 'Warm Charcoal', 'Forest']} value={tweaks.heroTone} onChange={v => setTweak('heroTone', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div>
      <Nav scrolled={scrolled} />
      <Hero />
      <Experience />
      <Projects />
      <CaseStudies />
      <Skills />
      <Credentials />
      <Footer />
      <PortfolioTweaks />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
