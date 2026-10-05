'use client';

import React, {
  useRef,
  useEffect,
  useState,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  CSSProperties,
} from 'react';

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  size?: 'sm' | 'md' | 'lg';
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type PlasmaButtonProps = ButtonProps | AnchorProps;

const VS_SOURCE = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FS_SOURCE = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_heat;
uniform float u_flash;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.02+vec2(17.3,9.1); a*=0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x/u_res.y, 1.0) * 2.1;
  float t = u_time;
  float heat = u_heat + u_flash * 1.3;
  vec2 q = vec2(fbm(p + vec2(0.0, t*0.32)), fbm(p + vec2(5.2, t*0.27)));
  vec2 r = vec2(fbm(p + 1.7*q + vec2(1.7, 9.2) + t*0.12),
                fbm(p + 1.6*q + vec2(8.3, 2.8) + t*0.09));
  float v = fbm(p + 2.1*r);
  float m = v*1.4 + heat*0.22;
  vec3 c1 = vec3(0.004, 0.008, 0.035);
  vec3 c2 = vec3(0.04, 0.08, 0.35);
  vec3 c3 = vec3(0.0, 0.6, 1.0);
  vec3 c4 = vec3(0.7, 0.9, 1.0);
  vec3 col = mix(c1, c2, smoothstep(0.2, 0.52, m));
  col = mix(col, c3, smoothstep(0.52, 0.8, m));
  col = mix(col, c4, smoothstep(0.82, 1.02, m));
  float vein = exp(-abs(q.x - q.y) * 9.0);
  col += c3 * vein * (0.12 + heat * 0.25);
  vec2 e = uv * (1.0 - uv);
  float vig = pow(e.x * e.y * 16.0, 0.28);
  col *= mix(0.5, 1.0, vig);
  col *= 0.78 + heat * 0.5;
  col += vec3(0.82, 0.94, 1.0) * u_flash * 0.4 * (0.3 + v);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function PlasmaButton(props: PlasmaButtonProps) {
  const { children, className = '', style, size = 'md', href, ...rest } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Shader state refs
  const stateRef = useRef({
    heat: 0,
    heatTarget: 0,
    erupt: 0,
    churn: 0,
    last: 0,
    rafId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      setHasWebGL(false);
      return;
    }

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setHasWebGL(false);
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const locP = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uHeat = gl.getUniformLocation(prog, 'u_heat');
    const uFlash = gl.getUniformLocation(prog, 'u_flash');

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Perform resize only when dimensions actually change (never per-frame)
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(parent.clientWidth * dpr));
      const h = Math.max(1, Math.round(parent.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      ro = new ResizeObserver(() => resize());
      ro.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    const state = stateRef.current;
    state.last = performance.now();
    let isRunning = false;
    let isIntersecting = true;
    let isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;
    let lastRenderTimestamp = 0;

    const renderFrame = (now: number) => {
      if (!isRunning) return;

      const isHighActivity = state.heat > 0.05 || state.heatTarget > 0 || state.erupt > 0.05;
      const frameInterval = isHighActivity ? 16 : 32; // 60 FPS when active, 30 FPS when idle

      if (now - lastRenderTimestamp >= frameInterval) {
        lastRenderTimestamp = now;
        const dt = Math.min(0.05, (now - state.last) / 1000);
        state.last = now;
        state.heat += (state.heatTarget - state.heat) * Math.min(1, dt * 6);
        state.erupt *= Math.exp(-3.2 * dt);
        state.churn += dt * (0.35 + state.heat * 1.1 + state.erupt * 2.2);

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, reducedMotion ? 6.0 : state.churn);
        gl.uniform1f(uHeat, state.heat);
        gl.uniform1f(uFlash, state.erupt);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      state.rafId = requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      state.last = performance.now();
      state.rafId = requestAnimationFrame(renderFrame);
    };

    const stopLoop = () => {
      isRunning = false;
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    };

    // Pause when offscreen
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && canvas.parentElement) {
      io = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && isDocumentVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: '120px' }
      );
      io.observe(canvas.parentElement);
    }

    // Pause when browser tab is inactive
    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
      if (isIntersecting && isDocumentVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Initial start if visible
    if (isIntersecting && isDocumentVisible) {
      startLoop();
    }

    return () => {
      stopLoop();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  const handleMouseEnter = () => {
    stateRef.current.heatTarget = 1;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    stateRef.current.heatTarget = 0;
    setIsHovered(false);
  };

  const handleFocus = () => {
    stateRef.current.heatTarget = 1;
    setIsHovered(true);
  };

  const handleBlur = () => {
    stateRef.current.heatTarget = 0;
    setIsHovered(false);
  };

  const handleMouseDown = () => {
    stateRef.current.erupt = 1;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      stateRef.current.erupt = 1;
    }
  };

  const minHeightClass =
    size === 'lg' ? 'min-h-[58px] px-8 py-3.5' : size === 'sm' ? 'min-h-[42px] px-5 py-2' : 'min-h-[50px] px-6 py-2.5';

  const defaultBoxShadow =
    '0 20px 42px rgba(4, 98, 126, 0.28), 0 3px 10px rgba(2, 6, 20, 0.4), inset 0 1px 0 rgba(226, 241, 255, 0.18)';
  const hoverBoxShadow =
    '0 28px 56px rgba(0, 160, 230, 0.42), 0 4px 14px rgba(2, 6, 20, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35)';

  const combinedStyles: CSSProperties = {
    boxShadow: isHovered ? hoverBoxShadow : defaultBoxShadow,
    transition: 'all 240ms cubic-bezier(0.34, 1.4, 0.5, 1)',
    ...style,
  };

  const commonClassNames = `
    group relative inline-flex items-center justify-center gap-2.5 
    border border-[rgba(0,210,255,0.22)] rounded-xl overflow-hidden cursor-pointer 
    bg-[#050b1a] text-[#e2f1ff] font-semibold text-[13.5px] tracking-wide 
    outline-none select-none
    hover:-translate-y-[2px] active:translate-y-[1px] active:scale-[0.985] 
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00d2ff] focus-visible:outline-offset-[3px]
    ${minHeightClass} ${className}
  `;

  const canvasLayer = (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block rounded-[inherit] pointer-events-none ${
          !hasWebGL ? 'hidden' : ''
        }`}
        aria-hidden="true"
      />
      {!hasWebGL && (
        <div
          className="absolute inset-0 block rounded-[inherit] pointer-events-none"
          style={{
            background:
              'radial-gradient(130% 170% at 50% 118%, #61d3ff 0%, #33a7ff 24%, #084c8e 56%, #050a19 88%)',
          }}
          aria-hidden="true"
        />
      )}
      {/* Subtle plasma edge glow vignette */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0, 210, 255, 0.25)',
          opacity: isHovered ? 1 : 0.6,
        }}
        aria-hidden="true"
      />
    </>
  );

  const contentLayer = (
    <span
      className="relative z-10 pointer-events-none inline-flex items-center justify-center gap-2"
      style={{
        textShadow: '0 1px 12px rgba(0, 16, 40, 0.95), 0 0 20px rgba(0, 210, 255, 0.3)',
      }}
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        ref={containerRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={commonClassNames}
        style={combinedStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {canvasLayer}
        {contentLayer}
      </a>
    );
  }

  return (
    <button
      ref={containerRef as React.Ref<HTMLButtonElement>}
      type={(rest as ButtonHTMLAttributes<HTMLButtonElement>).type || 'button'}
      className={commonClassNames}
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {canvasLayer}
      {contentLayer}
    </button>
  );
}

export default PlasmaButton;
