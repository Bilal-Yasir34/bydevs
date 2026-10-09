'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Layers3,
  Cpu,
  ShieldCheck,
  Zap,
  Database,
  Globe2,
  Bot,
  Activity,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { PlasmaButton } from './PlasmaButton';

export function Parallax3DSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'ai' | 'cloud' | 'security' | 'database'>('all');

  // Physics-based lerp values kept in refs to bypass React re-renders during mouse movement
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, isHovered: false });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let active = true;
    let isVisible = true;

    // IntersectionObserver to only animate when 3D section is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }

    const animate = () => {
      if (!active) return;

      if (isVisible) {
        const m = mouseRef.current;
        const diffX = m.targetX - m.currentX;
        const diffY = m.targetY - m.currentY;

        // If active movement or not at resting state
        if (m.isHovered || Math.abs(diffX) > 0.01 || Math.abs(diffY) > 0.01) {
          const ease = m.isHovered ? 0.12 : 0.06;
          m.currentX += diffX * ease;
          m.currentY += diffY * ease;

          if (sceneRef.current) {
            sceneRef.current.style.transform = `perspective(1100px) rotateX(${m.currentX.toFixed(2)}deg) rotateY(${m.currentY.toFixed(2)}deg)`;
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const maxRot = 12;
    mouseRef.current.targetX = -(y / (rect.height / 2)) * maxRot;
    mouseRef.current.targetY = (x / (rect.width / 2)) * maxRot;
    mouseRef.current.isHovered = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseRef.current.isHovered = false;
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseRef.current.isHovered = true;
  }, []);

  return (
    <section id="architecture-3d" className="section parallax-3d-section" aria-label="3D Interactive Architecture Matrix">
      <div className="container">
        <div className="parallax-heading-row">
          <div>
            <p className="eyebrow blue-eyebrow">
              <Sparkles size={14} /> IMMERSIVE 3D SYSTEM MATRIX
            </p>
            <h2>
              Multi-layer architecture.<br />
              <em>Engineered in depth.</em>
            </h2>
          </div>
          <div className="parallax-lead-wrap">
            <p>
              Explore our layered technical architecture. Move your cursor over the interactive stage to experience true multi-depth spatial perspective and real-time telemetry.
            </p>
            <div className="parallax-layer-selectors">
              {(
                [
                  { id: 'all', label: 'Complete Matrix', icon: Layers3 },
                  { id: 'ai', label: 'AI Engine', icon: Bot },
                  { id: 'cloud', label: 'Edge Cloud', icon: Globe2 },
                  { id: 'security', label: 'Zero-Trust Shield', icon: ShieldCheck },
                  { id: 'database', label: 'Data Hub', icon: Database },
                ] as const
              ).map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveLayer(tab.id)}
                    className={`layer-selector-pill ${activeLayer === tab.id ? 'active' : ''}`}
                    type="button"
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive 3D Canvas Stage */}
        <div
          ref={stageRef}
          className="parallax-stage-wrapper"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Ambient Lighting Background */}
          <div className="parallax-ambient-glow" aria-hidden="true" />
          <div className="parallax-grid-lines" aria-hidden="true" />

          {/* 3D Transform Object (GPU Direct) */}
          <div
            ref={sceneRef}
            className="parallax-3d-scene"
            style={{
              transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg)',
              willChange: 'transform',
            }}
          >
            {/* --- LAYER 1 (Depth: 0px): Cybernetic Hologram Floor & Axis --- */}
            <div className="parallax-layer layer-floor" style={{ transform: 'translateZ(0px)' }} aria-hidden="true">
              <div className="hologram-radar-ring ring-1" />
              <div className="hologram-radar-ring ring-2" />
              <div className="hologram-radar-ring ring-3" />
              <div className="radar-sweep-beam" />
            </div>

            {/* --- LAYER 2 (Depth: 40px): Connecting Neural Matrix Lines --- */}
            <div className="parallax-layer layer-connectors" style={{ transform: 'translateZ(40px)' }} aria-hidden="true">
              <svg className="matrix-svg-lines" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 400 250 L 160 120" stroke="url(#cyanGlow)" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M 400 250 L 640 120" stroke="url(#blueGlow)" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M 400 250 L 160 380" stroke="url(#purpleGlow)" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M 400 250 L 640 380" stroke="url(#emeraldGlow)" strokeWidth="2" strokeDasharray="6 6" />
                <defs>
                  <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#24c8ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1677ff" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1677ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1677ff" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* --- LAYER 3 (Depth: 75px): Center Core Platform --- */}
            <div
              className={`parallax-layer layer-core ${activeLayer !== 'all' ? 'dimmed' : ''}`}
              style={{ transform: 'translateZ(75px)' }}
            >
              <div className="core-glass-card">
                <div className="core-header">
                  <div className="core-badge">
                    <Cpu size={16} className="text-cyan-400 animate-pulse" />
                    <span>BY DEVS CORE OS</span>
                  </div>
                  <div className="core-status">
                    <span className="live-dot" /> 99.99% UPTIME
                  </div>
                </div>

                <div className="core-metrics">
                  <div className="core-metric-item">
                    <small>Throughput</small>
                    <strong>48.2k req/s</strong>
                    <div className="mini-bar"><span style={{ width: '84%' }} /></div>
                  </div>
                  <div className="core-metric-item">
                    <small>Latency</small>
                    <strong style={{ color: '#24c8ff' }}>14ms avg</strong>
                    <div className="mini-bar"><span style={{ width: '92%', background: '#24c8ff' }} /></div>
                  </div>
                  <div className="core-metric-item">
                    <small>Cloud Mesh</small>
                    <strong style={{ color: '#10b981' }}>8 Regions</strong>
                    <div className="mini-bar"><span style={{ width: '100%', background: '#10b981' }} /></div>
                  </div>
                </div>

                <div className="core-footer">
                  <Activity size={14} className="text-blue-400" />
                  <span>Real-time autonomous scaling & microservice telemetry</span>
                </div>
              </div>
            </div>

            {/* --- LAYER 4 (Depth: 110px - 140px): 4 Floating Holographic Satellite Modules --- */}
            
            {/* Satellite 1: Top-Left AI Intelligence Engine */}
            <div
              className={`parallax-layer satellite-card sat-top-left ${
                activeLayer === 'ai' || activeLayer === 'all' ? 'active-highlight' : 'dimmed'
              }`}
              style={{ transform: 'translateZ(120px)' }}
            >
              <div className="satellite-inner">
                <div className="sat-icon-wrap icon-purple">
                  <Bot size={18} />
                </div>
                <div>
                  <small>NEURAL ENGINE</small>
                  <strong>Agentic AI & LLMs</strong>
                  <p>Autonomous task execution & natural language query pipelines.</p>
                </div>
                <div className="sat-stat">
                  <span>Inference: <b>0.18s</b></span>
                </div>
              </div>
            </div>

            {/* Satellite 2: Top-Right Global Edge CDN */}
            <div
              className={`parallax-layer satellite-card sat-top-right ${
                activeLayer === 'cloud' || activeLayer === 'all' ? 'active-highlight' : 'dimmed'
              }`}
              style={{ transform: 'translateZ(135px)' }}
            >
              <div className="satellite-inner">
                <div className="sat-icon-wrap icon-blue">
                  <Globe2 size={18} />
                </div>
                <div>
                  <small>DISTRIBUTED CLOUD</small>
                  <strong>Global Edge Mesh</strong>
                  <p>Worldwide multi-zone cache, instant DNS & automatic failover.</p>
                </div>
                <div className="sat-stat">
                  <span>Edge PoPs: <b>285+</b></span>
                </div>
              </div>
            </div>

            {/* Satellite 3: Bottom-Left Zero-Trust Security */}
            <div
              className={`parallax-layer satellite-card sat-bottom-left ${
                activeLayer === 'security' || activeLayer === 'all' ? 'active-highlight' : 'dimmed'
              }`}
              style={{ transform: 'translateZ(125px)' }}
            >
              <div className="satellite-inner">
                <div className="sat-icon-wrap icon-emerald">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <small>SECURITY MATRIX</small>
                  <strong>Zero-Trust & RLS</strong>
                  <p>End-to-end encryption, row-level policies & biometric auth.</p>
                </div>
                <div className="sat-stat">
                  <span>Audit: <b>Grade A+</b></span>
                </div>
              </div>
            </div>

            {/* Satellite 4: Bottom-Right High-Speed Database */}
            <div
              className={`parallax-layer satellite-card sat-bottom-right ${
                activeLayer === 'database' || activeLayer === 'all' ? 'active-highlight' : 'dimmed'
              }`}
              style={{ transform: 'translateZ(140px)' }}
            >
              <div className="satellite-inner">
                <div className="sat-icon-wrap icon-cyan">
                  <Database size={18} />
                </div>
                <div>
                  <small>DATA PIPELINE</small>
                  <strong>Real-Time Database</strong>
                  <p>PostgreSQL with instant WebSocket sync & multi-replica backup.</p>
                </div>
                <div className="sat-stat">
                  <span>Replication: <b>Sub-5ms</b></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA for 3D section */}
        <div className="parallax-bottom-cta">
          <div className="p-cta-text">
            <strong>Ready to architect your business system in high definition?</strong>
            <span>Let&apos;s engineer software that grows effortlessly alongside your operations.</span>
          </div>
          <PlasmaButton href="#contact" size="md">
            Start Architectural Blueprint <ArrowRight size={16} />
          </PlasmaButton>
        </div>
      </div>
    </section>
  );
}

export default Parallax3DSection;
