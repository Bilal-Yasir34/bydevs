'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  { icon: '🚀', highlight: 'Q2 2026 BOOKINGS OPEN', text: 'Now accepting new custom software & cloud projects' },
  { icon: '⚡', highlight: 'HIGH-PERFORMANCE', text: 'Sub-second response times & scalable cloud architectures' },
  { icon: '🛡️', highlight: '99.99% UPTIME', text: 'Enterprise-grade SLA reliability & zero-trust security' },
  { icon: '🤖', highlight: 'AGENTIC AI', text: 'Intelligent business automation & custom LLM integrations' },
  { icon: '💼', highlight: 'CUSTOM ERP & POS', text: 'Bespoke systems engineered around your exact workflows' },
  { icon: '⭐', highlight: '4.9/5 RATED', text: 'Trusted by founders, CTOs & enterprise teams worldwide' },
  { icon: '⏱️', highlight: 'RAPID DELIVERY', text: '2-4 week milestone sprints with dedicated senior engineers' },
];

export function StickyTopTicker() {
  return (
    <aside className="sticky-top-ticker" aria-label="Announcement ticker">
      <div className="ticker-badge-lead">
        <span className="ticker-pulse-dot" aria-hidden="true" />
        <span className="ticker-lead-text">LIVE STATUS</span>
      </div>

      <div className="ticker-track-wrapper">
        <div className="ticker-marquee-content" tabIndex={0} aria-label="BY Devs live announcements">
          {/* First set */}
          {TICKER_ITEMS.map((item, index) => (
            <div key={`ticker-a-${index}`} className="ticker-item">
              <span className="ticker-item-icon">{item.icon}</span>
              <strong className="ticker-item-highlight">{item.highlight}</strong>
              <span className="ticker-item-sep">•</span>
              <span className="ticker-item-desc">{item.text}</span>
            </div>
          ))}
          {/* Duplicated for seamless infinite loop */}
          {TICKER_ITEMS.map((item, index) => (
            <div key={`ticker-b-${index}`} className="ticker-item" aria-hidden="true">
              <span className="ticker-item-icon">{item.icon}</span>
              <strong className="ticker-item-highlight">{item.highlight}</strong>
              <span className="ticker-item-sep">•</span>
              <span className="ticker-item-desc">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#contact" className="ticker-cta-link">
        <span>Start Project</span>
        <ArrowRight size={13} />
      </a>
    </aside>
  );
}

export default StickyTopTicker;
