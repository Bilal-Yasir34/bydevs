'use client';

import { FormEvent, useEffect, useState } from 'react';
import { PlasmaButton } from '@/components/PlasmaButton';
import { CircleButtons } from '@/src/shaders/circle-buttons/CircleButtons';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Boxes,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  Facebook,
  Factory,
  Github,
  Instagram,
  Layers3,
  Linkedin,
  Loader2,
  Menu,
  Network,
  PanelTop,
  Phone,
  Play,
  Plus,
  Puzzle,
  ScanSearch,
  ServerCog,
  Settings2,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  Workflow,
  X,
} from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/countries';

const services = [
  { icon: Code2, number: '01', title: 'Custom Web Applications', text: 'Purpose-built applications designed around your exact workflows, users and business requirements.' },
  { icon: Cloud, number: '02', title: 'Cloud Business Systems', text: 'Secure cloud-based systems for managing operations, data, inventory, sales, payments and more.' },
  { icon: ShoppingBag, number: '03', title: 'E-Commerce', text: 'Fast, scalable online stores with custom functionality, payment integrations and powerful management systems.' },
  { icon: Layers3, number: '04', title: 'Enterprise Software', text: 'Role-based systems that connect teams, processes and business information in one place.' },
  { icon: Workflow, number: '05', title: 'Automation & Integrations', text: 'Connect your tools and automate repetitive workflows using APIs, webhooks and intelligent automation.' },
  { icon: Bot, number: '06', title: 'AI-Powered Solutions', text: 'Practical AI features that help businesses analyze information, automate tasks and work smarter.' },
];

const projects = [
  { icon: Factory, type: 'Business systems', title: 'Enterprise Distribution System', text: 'A cloud-based management system for business information, receivables, roles and daily operations.', tone: 'blue' },
  { icon: Store, type: 'Retail technology', title: 'POS System', text: 'A custom point-of-sale experience for products, inventory, sales, invoices and barcode workflows.', tone: 'ink' },
  { icon: ShoppingBag, type: 'Commerce', title: 'E-Commerce Platforms', text: 'Custom online stores for fashion and cosmetics businesses, built to be managed with confidence.', tone: 'sky' },
  { icon: Stethoscope, type: 'Healthcare software', title: 'Hospital Management System', text: 'A role-based platform connecting staff, doctors and patients through one clear system.', tone: 'slate' },
  { icon: ScanSearch, type: 'Booking technology', title: 'Appointment Booking System', text: 'A focused booking platform designed around the needs of a visa agency.', tone: 'blue' },
  { icon: PanelTop, type: 'Brand experience', title: 'Brand Showcase Website', text: 'A product-focused website designed to present a textile business and its products professionally.', tone: 'ink' },
];

const process = [
  ['01', 'Discover', 'We understand your business, workflow and goals.'],
  ['02', 'Design', 'We turn requirements into a clear, intuitive digital experience.'],
  ['03', 'Build', 'We develop, integrate and test your system with scalability in mind.'],
  ['04', 'Launch & Improve', 'We deploy your product and continue improving it as your business grows.'],
];

const aiTools = ['AI Business Assistant', 'Intelligent Data Analysis', 'Content Generation', 'Workflow Automation', 'AI Image Tools', 'Smart Search'];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-b">B</span><span className="brand-y">Y</span>
    </span>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#top" className={`logo ${light ? 'logo-light' : ''}`}><BrandMark /><span>BY <b>Devs</b></span></a>;
}

function DashboardVisual() {
  return (
    <div className="dashboard-stage" aria-label="Abstract BY Devs business operating system visual">
      <div className="stage-orbit orbit-one" /><div className="stage-orbit orbit-two" />
      <div className="dashboard-main glass-panel">
        <div className="dash-top"><div><span className="dash-kicker">BUSINESS OS</span><strong>Overview</strong></div><div className="dash-dots"><i /><i /><i /></div></div>
        <div className="dash-tabs"><span className="active">All activity</span><span>Performance</span><span>Operations</span></div>
        <div className="metric-grid"><div className="metric-card"><span>Revenue flow</span><strong>+24.8%</strong><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="metric-card"><span>Active systems</span><strong>08</strong><div className="active-line"><b /><b /><b /><b /></div></div></div>
        <div className="activity-head"><span>Recent activity</span><span className="live"><b /> Live</span></div>
        <div className="activity-row"><div className="activity-icon blue-icon"><Database size={14} /></div><div><strong>Inventory synced</strong><small>Warehouse system · Just now</small></div><Check size={16} className="check" /></div>
        <div className="activity-row"><div className="activity-icon cyan-icon"><Workflow size={14} /></div><div><strong>Order workflow automated</strong><small>Commerce platform · 4m ago</small></div><Check size={16} className="check" /></div>
        <div className="activity-row"><div className="activity-icon dark-icon"><Bot size={14} /></div><div><strong>AI assistant ready</strong><small>Customer operations · 12m ago</small></div><ArrowUpRight size={16} className="check" /></div>
      </div>
      <div className="float-card cloud-card glass-panel"><div className="mini-icon"><Cloud size={17} /></div><div><span>Cloud status</span><strong>All systems operational</strong></div><b className="status-dot" /></div>
      <div className="float-card automation-card glass-panel"><div className="mini-icon violet-free"><Settings2 size={17} /></div><div><span>Automation</span><strong>12 tasks completed</strong></div><span className="tiny-arrow"><ArrowUpRight size={14} /></span></div>
      <div className="ai-bubble glass-panel"><Sparkles size={16} /><span>How can I help your business?</span></div>
    </div>
  );
}

function ProjectPreview({ tone, icon: Icon }: { tone: string; icon: typeof Factory }) {
  return <div className={`project-preview preview-${tone}`}><div className="preview-chrome"><span /><span /><span /><i>BY / workspace</i></div><div className="preview-body"><div className="preview-sidebar"><b /><b /><b /><b /></div><div className="preview-content"><div className="preview-content-top"><span /><span /><span /></div><div className="preview-big-card"><div><small>Workspace overview</small><strong>Connected operations</strong></div><Icon size={28} /></div><div className="preview-bars"><i /><i /><i /><i /></div><div className="preview-bottom"><span /><span /><span /></div></div></div></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY.code);
  const [dialCode, setDialCode] = useState(DEFAULT_COUNTRY.dial);
  const [phone, setPhone] = useState('');
  const [activeProject, setActiveProject] = useState(0);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setDialCode(country.dial);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const countryObj = COUNTRIES.find(c => c.code === selectedCountry) || DEFAULT_COUNTRY;

    const payload = {
      name: formData.get('name'),
      company: formData.get('company'),
      email: formData.get('email'),
      country: countryObj.name,
      country_code: dialCode,
      phone: phone.trim(),
      service: formData.get('need'),
      budget: formData.get('budget'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSent(true);
      form.reset();
      setPhone('');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services', num: '01' },
    { name: 'Work', href: '#work', num: '02' },
    { name: 'Process', href: '#process', num: '03' },
    { name: 'About', href: '#about', num: '04' },
    { name: 'Contact', href: '#contact', num: '05' },
  ];

  return (
    <main id="top">
      <header className="site-header">
        <div className="nav-wrap">
          <Logo />
          <nav className="desktop-nav">
            {navLinks.map((item) => (
              <a key={item.name} href={item.href}>
                {item.name}
              </a>
            ))}
          </nav>
          <a className="talk-link" href="#contact">
            Let&apos;s Talk <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Slide-in Mobile Drawer & Backdrop */}
      <div
        className={`mobile-drawer-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <aside
        className={`mobile-drawer ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-header">
          <Logo />
          <button
            className="mobile-drawer-close"
            onClick={closeMenu}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mobile-drawer-kicker">Navigation</div>

        <nav className="mobile-drawer-nav">
          {navLinks.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="mobile-nav-item"
              style={{
                transitionDelay: menuOpen ? `${130 + index * 65}ms` : '0ms',
              }}
              onClick={closeMenu}
            >
              <span className="mobile-nav-num">{item.num}</span>
              <span className="mobile-nav-title">{item.name}</span>
              <ArrowRight size={16} className="mobile-nav-arrow" />
            </a>
          ))}
        </nav>

        <div
          className="mobile-drawer-footer"
          style={{
            transitionDelay: menuOpen ? `${130 + navLinks.length * 65}ms` : '0ms',
          }}
        >
          <a
            href="#contact"
            className="mobile-drawer-cta"
            onClick={closeMenu}
          >
            <span>Start Project / Let&apos;s Talk</span>
            <ArrowUpRight size={17} />
          </a>
          <div className="mobile-drawer-contact">
            <small>Direct Email</small>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.bydevs@gmail.com" target="_blank" rel="noopener noreferrer">hello.bydevs@gmail.com</a>
          </div>
          <div className="mobile-drawer-socials">
            <CircleButtons
              variant="mail"
              mode="light"
              hue={0}
              saturation={1.00}
              brightness={1.00}
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.bydevs@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Compose email to hello.bydevs@gmail.com on Gmail"
            />
            <CircleButtons
              variant="mail"
              mode="light"
              hue={0}
              saturation={1.00}
              brightness={1.00}
              href="https://www.facebook.com/profile.php?id=61595093072452"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Facebook"
            >
              <Facebook size={18} />
            </CircleButtons>
            <CircleButtons
              variant="mail"
              mode="light"
              hue={0}
              saturation={1.00}
              brightness={1.00}
              href="https://www.instagram.com/hello.bydevs/"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Instagram"
            >
              <Instagram size={18} />
            </CircleButtons>
            <CircleButtons
              variant="mail"
              mode="light"
              hue={0}
              saturation={1.00}
              brightness={1.00}
              href="https://www.linkedin.com/in/bilal-yasir-3b58b5325/"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="LinkedIn"
            >
              <Linkedin size={18} />
            </CircleButtons>
            <CircleButtons
              variant="mail"
              mode="light"
              hue={0}
              saturation={1.00}
              brightness={1.00}
              href="https://github.com/Bilal-Yasir34"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="GitHub"
            >
              <Github size={18} />
            </CircleButtons>
          </div>
        </div>
      </aside>

      <section className="hero section-grid"><div className="hero-glow" /><div className="container hero-inner"><div className="hero-copy"><p className="eyebrow"><span /> WEB <b>•</b> CLOUD <b>•</b> SOFTWARE</p><h1>Digital systems<br /><em>built for</em> real businesses.</h1><p className="hero-lead">BY Devs builds custom web applications, cloud-based systems, business software and intelligent digital solutions designed around the way your business actually works.</p><div className="hero-actions"><PlasmaButton href="#contact" size="md">Start Project <ArrowRight size={17} /></PlasmaButton><a href="#work" className="text-link">View Our Work <ArrowDownRight size={17} /></a></div><div className="hero-note"><span className="note-line" /><span>From idea to deployment — we build the technology that moves businesses forward.</span></div></div><DashboardVisual /></div></section>

      <section id="services" className="section services-section"><div className="container"><div className="section-heading two-col"><div><p className="eyebrow blue-eyebrow">WHAT WE DO</p><h2>Technology that works <em>around</em> your business.</h2></div><p>Every business is different. We build software around your workflows instead of forcing your business into someone else&apos;s template.</p></div><div className="service-grid">{services.map(({ icon: Icon, number, title, text }) => <article className="service-card" key={title}><div className="service-top"><div className="service-icon"><Icon size={21} /></div><span>{number}</span></div><h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Learn about ${title}`}><ArrowUpRight size={18} /></a></article>)}</div></div></section>

      <section id="work" className="section work-section"><div className="container"><div className="section-heading work-heading"><div><p className="eyebrow blue-eyebrow">SELECTED WORK</p><h2>Built for businesses.<br /><em>Not just portfolios.</em></h2></div><p>Real-world systems and digital experiences designed to make complex business operations feel clear.</p></div><div className="project-showcase"><div className="project-list">{projects.map((project, index) => <button className={`project-item ${activeProject === index ? 'selected' : ''}`} key={project.title} onMouseEnter={() => setActiveProject(index)} onClick={() => setActiveProject(index)}><span className="project-index">0{index + 1}</span><span><small>{project.type}</small><strong>{project.title}</strong></span><ArrowUpRight size={19} /></button>)}</div><div className="project-feature"><ProjectPreview tone={projects[activeProject].tone} icon={projects[activeProject].icon} /><div className="feature-caption"><div><p>{projects[activeProject].type}</p><h3>{projects[activeProject].title}</h3><span>{projects[activeProject].text}</span></div><a href="#contact">View Case Study <ArrowRight size={16} /></a></div></div></div></div></section>

      <section id="process" className="section process-section"><div className="container"><div className="process-intro"><p className="eyebrow blue-eyebrow">THE PROCESS</p><h2>How we <em>build.</em></h2><p>A thoughtful process creates better software. We keep things clear, collaborative and focused on the outcome.</p></div><div className="process-line">{process.map(([number, title, text], index) => <div className="process-step" key={number}><div className="step-number">{number}</div><div className="step-connector"><span /></div><h3>{title}</h3><p>{text}</p>{index === process.length - 1 && <Check className="step-check" size={17} />}</div>)}</div></div></section>

      <section id="about" className="section why-section"><div className="container why-layout"><div className="why-copy"><p className="eyebrow blue-eyebrow">WHY BY DEVS</p><h2>Software should solve problems.<br /><em>Not create more of them.</em></h2><p>We combine business understanding with careful engineering to make technology feel like a natural part of how your company operates.</p><a href="#contact" className="text-link">Work with us <ArrowRight size={17} /></a></div><div className="architecture"><div className="arch-glow" /><div className="arch-node node-main"><Layers3 size={21} /><span>Core system</span></div><div className="arch-node node-a"><Database size={19} /><span>Data</span></div><div className="arch-node node-b"><Network size={19} /><span>Teams</span></div><div className="arch-node node-c"><Puzzle size={19} /><span>Integrations</span></div><div className="arch-node node-d"><Bot size={19} /><span>Intelligence</span></div><div className="arch-line line-a" /><div className="arch-line line-b" /><div className="arch-line line-c" /><div className="arch-line line-d" /></div></div><div className="container differentiators"><div><strong>Built Around You</strong><span>No unnecessary features. No forced templates.</span></div><div><strong>Cloud Ready</strong><span>Access your business systems securely from anywhere.</span></div><div><strong>Scalable Architecture</strong><span>Build today with tomorrow&apos;s growth in mind.</span></div><div><strong>Human Support</strong><span>You work directly with the people building your system.</span></div></div></section>

      <section className="ai-section"><div className="ai-grid" /><div className="container ai-layout"><div className="ai-copy"><p className="eyebrow light-eyebrow"><Sparkles size={14} /> INTELLIGENCE, PRACTICALLY APPLIED</p><h2>Make your software <em>smarter.</em></h2><p>AI is most useful when it solves a real business problem. We integrate practical AI capabilities into existing websites and business systems — from intelligent assistants to automation and data analysis.</p><PlasmaButton href="#contact" size="md">Explore AI Solutions <ArrowRight size={17} /></PlasmaButton></div><div className="ai-tools">{aiTools.map((tool, index) => <div className="ai-tool" key={tool}><span>0{index + 1}</span><div className="ai-tool-icon"><Sparkles size={16} /></div><strong>{tool}</strong><ArrowUpRight size={16} /></div>)}</div></div></section>

      <section className="section about-section"><div className="container about-layout"><div className="about-visual"><div className="code-window"><div className="window-top"><span /><span /><span /><small>bydevs / system-architecture</small></div><div className="code-lines"><p><b>01</b><span className="code-blue">const</span> business <span className="code-blue">=</span> {'{'}</p><p><b>02</b>&nbsp;&nbsp;clarity: <i>true</i>,</p><p><b>03</b>&nbsp;&nbsp;systems: [<i>&apos;web&apos;</i>, <i>&apos;cloud&apos;</i>],</p><p><b>04</b>&nbsp;&nbsp;readyToScale: <i>true</i></p><p><b>05</b>{'}'}</p><p><b>06</b><span className="code-muted">// built around your work</span></p></div></div><div className="about-badge"><Code2 size={16} /> Thoughtful by design</div></div><div className="about-copy"><p className="eyebrow blue-eyebrow">ABOUT BY DEVS</p><h2>Small team.<br /><em>Serious software.</em></h2><p>BY Devs is a software development brand focused on building custom web applications, cloud-based systems and business software for companies that need technology built around their operations.</p><PlasmaButton href="#contact" size="md">Work With BY Devs <ArrowUpRight size={17} /></PlasmaButton></div></div></section>

      <section id="contact" className="contact-section"><div className="container contact-layout"><div className="contact-copy"><p className="eyebrow blue-eyebrow">START A CONVERSATION</p><h2>Have a business problem<br /><em>worth solving?</em></h2><p>Tell us what you&apos;re trying to build, improve or automate. We&apos;ll help you figure out the right technical solution.</p><div className="contact-details"><a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.bydevs@gmail.com" target="_blank" rel="noopener noreferrer"><span>Email</span>hello.bydevs@gmail.com <ArrowUpRight size={15} /></a><div className="socials"><span>Find us online</span><div><CircleButtons variant="mail" mode="light" hue={0} saturation={1.00} brightness={1.00} href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.bydevs@gmail.com" target="_blank" rel="noopener noreferrer" ariaLabel="Compose email to hello.bydevs@gmail.com on Gmail" /><CircleButtons variant="mail" mode="light" hue={0} saturation={1.00} brightness={1.00} href="https://www.facebook.com/profile.php?id=61595093072452" target="_blank" rel="noopener noreferrer" ariaLabel="Facebook"><Facebook size={18} /></CircleButtons><CircleButtons variant="mail" mode="light" hue={0} saturation={1.00} brightness={1.00} href="https://www.instagram.com/hello.bydevs/" target="_blank" rel="noopener noreferrer" ariaLabel="Instagram"><Instagram size={18} /></CircleButtons><CircleButtons variant="mail" mode="light" hue={0} saturation={1.00} brightness={1.00} href="https://www.linkedin.com/in/bilal-yasir-3b58b5325/" target="_blank" rel="noopener noreferrer" ariaLabel="LinkedIn"><Linkedin size={18} /></CircleButtons><CircleButtons variant="mail" mode="light" hue={0} saturation={1.00} brightness={1.00} href="https://github.com/Bilal-Yasir34" target="_blank" rel="noopener noreferrer" ariaLabel="GitHub"><Github size={18} /></CircleButtons></div></div></div></div><form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label>Your Name *<input required name="name" placeholder="Bilal Yasir" /></label><label>Business / Company<input name="company" placeholder="Company or project name" /></label></div><div className="form-row"><label>Email Address *<input required type="email" name="email" placeholder="you@company.com" /></label><label>Country *<select required value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)} className="country-select">{COUNTRIES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.name} ({c.dial})</option>))}</select></label></div><div className="form-row"><label>Phone Number (Mandatory) *<div className="phone-input-wrap"><span className="dial-prefix-pill">{dialCode}</span><input required type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="300 1234567" className="phone-input-field" /></div></label><label>What do you need? *<select required name="need" defaultValue=""><option value="" disabled>Select a service</option><option>Custom web application</option><option>Cloud business system</option><option>E-commerce platform</option><option>Automation & integrations</option><option>AI-powered solutions</option><option>Enterprise software</option><option>Something else</option></select></label></div><label>Budget Range<select name="budget" defaultValue=""><option value="" disabled>Choose a range (Optional)</option><option>Under $500</option><option>$500 – $1,000</option><option>$1,000 – $3,000</option><option>$3,000 – $5,000</option><option>$5,000+</option></select></label><label>Project Overview / Message *<textarea required name="message" rows={4} placeholder="Describe what you want to build, current challenges, or goals..." /></label>{submitError && (<div className="form-error-banner"><AlertCircle size={16} /><span>{submitError}</span></div>)}<div className="form-submit"><PlasmaButton type="submit" size="md" className="min-w-[215px]">{submitting ? (<><Loader2 size={17} className="animate-spin" /> Saving Inquiry...</>) : sent ? (<>Inquiry Received <Check size={17} /></>) : (<>Send Project Inquiry <ArrowRight size={17} /></>)}</PlasmaButton>{sent && (<span className="form-success"><Check size={14} /> Received! We will review your requirements and reach out via phone & email.</span>)}</div></form></div></section>

      <footer className="site-footer"><div className="container footer-top"><div><Logo light /><p>Custom digital systems<br />built around your business.</p></div><div className="footer-nav"><span>Explore</span><a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></div><div className="footer-nav"><span>Connect</span><a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.bydevs@gmail.com" target="_blank" rel="noopener noreferrer">Email us</a><div className="footer-socials"><CircleButtons variant="mail" mode="dark" hue={0} saturation={1.00} brightness={1.00} href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.bydevs@gmail.com" target="_blank" rel="noopener noreferrer" ariaLabel="Compose email to hello.bydevs@gmail.com on Gmail" /><CircleButtons variant="mail" mode="dark" hue={0} saturation={1.00} brightness={1.00} href="https://www.facebook.com/profile.php?id=61595093072452" target="_blank" rel="noopener noreferrer" ariaLabel="Facebook"><Facebook size={18} /></CircleButtons><CircleButtons variant="mail" mode="dark" hue={0} saturation={1.00} brightness={1.00} href="https://www.instagram.com/hello.bydevs/" target="_blank" rel="noopener noreferrer" ariaLabel="Instagram"><Instagram size={18} /></CircleButtons><CircleButtons variant="mail" mode="dark" hue={0} saturation={1.00} brightness={1.00} href="https://www.linkedin.com/in/bilal-yasir-3b58b5325/" target="_blank" rel="noopener noreferrer" ariaLabel="LinkedIn"><Linkedin size={18} /></CircleButtons><CircleButtons variant="mail" mode="dark" hue={0} saturation={1.00} brightness={1.00} href="https://github.com/Bilal-Yasir34" target="_blank" rel="noopener noreferrer" ariaLabel="GitHub"><Github size={18} /></CircleButtons></div></div></div><div className="container footer-bottom"><span>© 2026 BY Devs. All rights reserved.</span><span>Web <i>•</i> Cloud <i>•</i> Software</span></div></footer>
    </main>
  );
}
