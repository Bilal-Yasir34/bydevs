'use client';

import React from 'react';
import {
  Code2,
  Database,
  Cloud,
  Layers3,
  ServerCog,
  Bot,
  ShieldCheck,
  Cpu,
  Globe2,
  Workflow,
  Sparkles,
  Zap,
} from 'lucide-react';

const TECH_ITEMS = [
  { icon: Code2, label: 'Next.js 14 / React', category: 'Frontend' },
  { icon: ServerCog, label: 'Node.js & TypeScript', category: 'Backend' },
  { icon: Database, label: 'PostgreSQL & Supabase', category: 'Data' },
  { icon: Cloud, label: 'AWS & Cloud Infrastructure', category: 'Cloud' },
  { icon: Bot, label: 'AI & Custom LLM Engines', category: 'Intelligence' },
  { icon: Zap, label: 'High-Speed WebSockets', category: 'Real-time' },
  { icon: ShieldCheck, label: 'Zero-Trust Security & RLS', category: 'Security' },
  { icon: Layers3, label: 'Custom ERP & POS Engines', category: 'Enterprise' },
  { icon: Globe2, label: 'Edge Network & Global CDN', category: 'Performance' },
  { icon: Workflow, label: 'Automated CI/CD & APIs', category: 'DevOps' },
  { icon: Cpu, label: 'Microservices & Redis', category: 'Scale' },
  { icon: Sparkles, label: 'TailwindCSS & Shader UI', category: 'Interface' },
];

export function TechStackTicker() {
  return (
    <section className="tech-ticker-section" aria-label="Technology stack and capabilities marquee">
      <div className="tech-ticker-heading">
        <span className="ticker-mini-label">ENTERPRISE-GRADE TECH STACK</span>
      </div>

      <div className="tech-ticker-container">
        <div className="tech-ticker-fade-left" aria-hidden="true" />
        <div className="tech-ticker-fade-right" aria-hidden="true" />

        <div className="tech-ticker-track">
          {/* First loop */}
          {TECH_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={`tech-a-${index}`} className="tech-pill">
                <div className="tech-pill-icon">
                  <Icon size={16} />
                </div>
                <div className="tech-pill-info">
                  <strong>{item.label}</strong>
                  <small>{item.category}</small>
                </div>
              </div>
            );
          })}
          {/* Duplicated loop for infinite scroll */}
          {TECH_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={`tech-b-${index}`} className="tech-pill" aria-hidden="true">
                <div className="tech-pill-icon">
                  <Icon size={16} />
                </div>
                <div className="tech-pill-info">
                  <strong>{item.label}</strong>
                  <small>{item.category}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TechStackTicker;
