'use client';

import React from 'react';
import {
  Star,
  CheckCircle2,
  Quote,
  Sparkles,
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  color: string;
  rating: number;
  project: string;
  review: string;
  metric?: string;
}

const ROW_1_REVIEWS: Testimonial[] = [
  {
    name: 'Marcus Vance',
    role: 'Chief Technology Officer',
    company: 'Apex Logistics Global',
    avatar: 'MV',
    color: 'linear-gradient(135deg, #1677ff, #24c8ff)',
    rating: 5,
    project: 'Cloud ERP & Fleet Tracking',
    review:
      'BY Devs completely transformed our nationwide distribution pipeline. What used to take our dispatchers 45 minutes of manual entry is now completely automated in real time. Rock-solid architecture and exceptional speed.',
    metric: '+340% Processing Speed',
  },
  {
    name: 'Sarah Lindqvist',
    role: 'Head of Digital Commerce',
    company: 'Nordix Retail Group',
    avatar: 'SL',
    color: 'linear-gradient(135deg, #7e22ce, #a855f7)',
    rating: 5,
    project: 'Custom E-Commerce Platform',
    review:
      'We replaced a slow, clunky Shopify plugin setup with a custom web application built by BY Devs. Our checkout conversion skyrocketed by 28% in the first month alone. Their attention to UX and performance is unmatched.',
    metric: '+28% Checkout Conversions',
  },
  {
    name: 'Dr. Hamza Tariq',
    role: 'Managing Director',
    company: 'MedCore Health Systems',
    avatar: 'HT',
    color: 'linear-gradient(135deg, #059669, #10b981)',
    rating: 5,
    project: 'Hospital Management & Scheduling',
    review:
      'Handling sensitive patient appointments across 6 clinical branches required strict compliance and zero downtime. BY Devs delivered a system so intuitive that our clinical staff needed virtually zero onboarding time.',
    metric: '100% Zero-Downtime Record',
  },
  {
    name: 'Elena Rostova',
    role: 'Founder & CEO',
    company: 'Veloce Fashion Apparel',
    avatar: 'ER',
    color: 'linear-gradient(135deg, #e11d48, #f43f5e)',
    rating: 5,
    project: 'Multi-Store POS & Inventory',
    review:
      'The custom POS software they built synchronizes our 4 physical stores with our online warehouse instantly. Barcode scanning, custom invoices, and end-of-day reconciliation work like magic.',
    metric: '4 Stores Real-Time Sync',
  },
  {
    name: 'David Sterling',
    role: 'VP of Engineering',
    company: 'CloudScale Analytics Inc.',
    avatar: 'DS',
    color: 'linear-gradient(135deg, #d97706, #f59e0b)',
    rating: 5,
    project: 'AI Intelligence & Data Pipeline',
    review:
      'Their ability to integrate practical LLM tools into our existing data warehouse saved us over 6 months of internal R&D. True engineers who understand both clean code and high-stakes business requirements.',
    metric: '6 Months R&D Saved',
  },
];

const ROW_2_REVIEWS: Testimonial[] = [
  {
    name: 'Zack Anderson',
    role: 'Chief Operating Officer',
    company: 'Metro Distribution & Supply',
    avatar: 'ZA',
    color: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    rating: 5,
    project: 'Receivables & Accounting Engine',
    review:
      'Our team was drowning in Excel sheets and invoice disputes. BY Devs built a custom ledger and invoice management tool that eliminated billing errors completely. The investment paid for itself in 60 days.',
    metric: 'Zero Invoice Errors',
  },
  {
    name: 'Kavita Patel',
    role: 'Product Lead',
    company: 'OmniFin Solutions',
    avatar: 'KP',
    color: 'linear-gradient(135deg, #9333ea, #c084fc)',
    rating: 5,
    project: 'Workflow Automation & APIs',
    review:
      'BY Devs engineered our automated webhook engine that bridges legacy banking APIs with our modern client dashboard. Communication was crystal clear, and milestones were delivered right on schedule.',
    metric: '12+ APIs Integrated',
  },
  {
    name: 'Liam O’Connor',
    role: 'Technical Director',
    company: 'Orbit Visa & Travel Services',
    avatar: 'LO',
    color: 'linear-gradient(135deg, #0d9488, #2dd4bf)',
    rating: 5,
    project: 'Client Booking & Document Vault',
    review:
      'We process thousands of visa applications monthly. The custom upload portal and automated document verification system cut client follow-up phone calls by over 70%. Phenomenal craftsmanship.',
    metric: '-70% Support Overhead',
  },
  {
    name: 'Tariq Al-Mansoor',
    role: 'General Manager',
    company: 'Apex Horizon Holding',
    avatar: 'TA',
    color: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    rating: 5,
    project: 'Corporate Operations Portal',
    review:
      'Working with BY Devs feels like having a senior in-house engineering team that actually cares about your business outcomes. Transparent communication, great aesthetics, and rock-solid code.',
    metric: '4.9/5 Team Satisfaction',
  },
  {
    name: 'Jessica Morales',
    role: 'Head of Operations',
    company: 'Syntrax Logistics Hub',
    avatar: 'JM',
    color: 'linear-gradient(135deg, #ea580c, #fb923c)',
    rating: 5,
    project: 'Warehouse Automation Matrix',
    review:
      'From the first architectural diagram to production rollout, BY Devs delivered flawless engineering. Their cloud software easily scales under peak season traffic without breaking a sweat.',
    metric: '4.8x Traffic Handled',
  },
];

function ReviewCard({ review }: { review: Testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-avatar" style={{ background: review.color }}>
          {review.avatar}
        </div>
        <div className="testimonial-author-meta">
          <div className="testimonial-author-name">
            <strong>{review.name}</strong>
            <span className="verified-badge" title="Verified Client">
              <CheckCircle2 size={13} />
            </span>
          </div>
          <p className="testimonial-author-role">
            {review.role} • <span>{review.company}</span>
          </p>
        </div>
      </div>

      <div className="testimonial-rating-row">
        <div className="star-rating" aria-label={`Rating: ${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={14} className="star-icon filled" />
          ))}
        </div>
        <span className="project-badge">{review.project}</span>
      </div>

      <blockquote className="testimonial-quote">
        &ldquo;{review.review}&rdquo;
      </blockquote>

      {review.metric && (
        <div className="testimonial-metric-chip">
          <TrendingUp size={13} />
          <span>{review.metric}</span>
        </div>
      )}
    </article>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="section testimonials-section" aria-label="Client Testimonials and Reviews">
      <div className="container">
        <div className="testimonials-intro">
          <div>
            <p className="eyebrow blue-eyebrow">
              <Sparkles size={14} /> CLIENT TESTIMONIALS & REVIEWS
            </p>
            <h2>
              Proven results.<br />
              <em>Trusted by leaders.</em>
            </h2>
          </div>
          <p>
            See how custom software, cloud systems, and intelligent automation built by BY Devs help companies scale faster, eliminate manual bottlenecks, and outperform competitors.
          </p>
        </div>

        {/* Highlight Stats Bar */}
        <div className="testimonials-stats-bar">
          <div className="t-stat-item">
            <strong>4.9 / 5.0</strong>
            <span>★★★★★ Client Satisfaction Rating</span>
          </div>
          <div className="t-stat-item">
            <strong>100%</strong>
            <span>Milestone On-Time Delivery</span>
          </div>
          <div className="t-stat-item">
            <strong>99.99%</strong>
            <span>SLA Production Uptime</span>
          </div>
          <div className="t-stat-item">
            <strong>4.2x</strong>
            <span>Average Client ROI & Efficiency</span>
          </div>
        </div>
      </div>

      {/* Marquee Ticker Track 1 (Scrolling Left) */}
      <div className="testimonials-marquee-wrapper" aria-label="Client reviews ticker row 1">
        <div className="t-fade-left" aria-hidden="true" />
        <div className="t-fade-right" aria-hidden="true" />

        <div className="testimonials-track track-left">
          {ROW_1_REVIEWS.map((review, index) => (
            <ReviewCard key={`row1-a-${index}`} review={review} />
          ))}
          {ROW_1_REVIEWS.map((review, index) => (
            <ReviewCard key={`row1-b-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Marquee Ticker Track 2 (Scrolling Right) */}
      <div className="testimonials-marquee-wrapper mt-4" aria-label="Client reviews ticker row 2">
        <div className="t-fade-left" aria-hidden="true" />
        <div className="t-fade-right" aria-hidden="true" />

        <div className="testimonials-track track-right">
          {ROW_2_REVIEWS.map((review, index) => (
            <ReviewCard key={`row2-a-${index}`} review={review} />
          ))}
          {ROW_2_REVIEWS.map((review, index) => (
            <ReviewCard key={`row2-b-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
