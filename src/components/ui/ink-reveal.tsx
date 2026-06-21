"use client";
import { useEffect, useRef, useCallback } from "react";

interface InkRevealProps {
  /** RGB color of the mask overlay (reveal mode), e.g. [252, 250, 248] */
  maskColor?: [number, number, number];
  /**
   * "reveal" (default): a solid mask you carve away to expose what's behind.
   * "paint": a transparent canvas where the cursor lays down a fading ink trail.
   */
  mode?: "reveal" | "paint";
  /** RGB color of the ink in "paint" mode (used when `hueFlow` is off) */
  inkColor?: [number, number, number];
  /** Paint mode: cycle each stamp through a flowing rainbow of hues. */
  hueFlow?: boolean;
  /** How fast the flowing hue advances per stamp (degrees). */
  hueStep?: number;
  /** Paint mode: additively blend stamps so overlaps glow (neon). */
  glow?: boolean;
  /** Radius of each ink stamp in px */
  brushSize?: number;
  /** How long each stamp lives before fading (ms) */
  lifetime?: number;
  /** Initial radius before the stamp expands */
  rStart?: number;
  /** Random variation factor for stamp radius (0–1) */
  rVary?: number;
  /** Min pixel distance between stamps along a stroke */
  stampStep?: number;
  /** Max stamps alive at once (oldest are pruned) */
  maxStamps?: number;
  /** Number of segments on the wobble circle (higher = smoother) */
  segments?: number;
  /** Wobble amplitude weights [primary, secondary, tertiary] */
  wobble?: [number, number, number];
  /** Gradient inner-radius factor (0–1, relative to stamp radius) */
  gradientInnerRadius?: number;
  /** Gradient opacity stops [center, mid, edge] */
  gradientStops?: [number, number, number];
  /** Extra CSS class for the canvas element */
  className?: string;
  /** Extra inline styles for the canvas element */
  style?: React.CSSProperties;
}

interface Stamp {
  x: number;
  y: number;
  born: number;
  seed: number;
  rmax: number;
  color: [number, number, number];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export default function InkReveal({
  maskColor = [252, 250, 248],
  mode = "reveal",
  inkColor = [139, 108, 255],
  hueFlow = false,
  hueStep = 13,
  glow = false,
  brushSize = 128,
  lifetime = 600,
  rStart = 10,
  rVary = 0.45,
  stampStep = 10,
  maxStamps = 200,
  segments = 36,
  wobble = [0.14, 0.08, 0.05],
  gradientInnerRadius = 0.2,
  gradientStops = [0.95, 0.88, 0],
  className,
  style,
}: InkRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stampsRef = useRef<Stamp[]>([]);
  const runningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastClientRef = useRef<{ x: number; y: number } | null>(null);
  const hueRef = useRef(Math.random() * 360);
  const dimsRef = useRef({ w: 0, h: 0 });

  const mc = maskColor;
  const ic = inkColor;
  const isPaint = mode === "paint";

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    dimsRef.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    if (isPaint) {
      ctx.clearRect(0, 0, w, h);
    } else {
      ctx.fillStyle = `rgb(${mc[0]},${mc[1]},${mc[2]})`;
      ctx.fillRect(0, 0, w, h);
    }
  }, [mc, isPaint]);

  const carveInk = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      seed: number,
      alpha: number,
      color: [number, number, number]
    ) => {
      const col = `${color[0]},${color[1]},${color[2]}`;
      const g = ctx.createRadialGradient(
        x, y, r * gradientInnerRadius,
        x, y, r
      );
      g.addColorStop(0, `rgba(${col},${gradientStops[0] * alpha})`);
      g.addColorStop(0.5, `rgba(${col},${gradientStops[1] * alpha})`);
      g.addColorStop(1, `rgba(${col},${gradientStops[2] * alpha})`);
      ctx.fillStyle = g;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const wob =
          0.78 +
          wobble[0] * Math.sin(a * 3 + seed) +
          wobble[1] * Math.sin(a * 5 + seed * 2.1) +
          wobble[2] * Math.sin(a * 7 + seed * 0.7);
        const px = x + Math.cos(a) * r * wob;
        const py = y + Math.sin(a) * r * wob;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    },
    [segments, wobble, gradientInnerRadius, gradientStops]
  );

  const nextColor = useCallback((): [number, number, number] => {
    if (!isPaint) return [0, 0, 0];
    if (!hueFlow) return ic;
    const c = hslToRgb(hueRef.current, 0.95, 0.58);
    hueRef.current = (hueRef.current + hueStep) % 360;
    return c;
  }, [isPaint, hueFlow, hueStep, ic]);

  const addStamp = useCallback(
    (x: number, y: number) => {
      const stamps = stampsRef.current;
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
        color: nextColor(),
      });
    },
    [brushSize, rVary, maxStamps, nextColor]
  );

  const stampAlong = useCallback(
    (x: number, y: number) => {
      const last = lastPosRef.current;
      if (!last) {
        addStamp(x, y);
      } else {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / stampStep));
        for (let i = 1; i <= steps; i++) {
          addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
        }
      }
      lastPosRef.current = { x, y };
    },
    [addStamp, stampStep]
  );

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dimsRef.current;
    const now = performance.now();
    const stamps = stampsRef.current;

    if (isPaint) {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = glow ? "lighter" : "source-over";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${mc[0]},${mc[1]},${mc[2]})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-out";
    }

    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / lifetime;
      if (t >= 1) {
        stamps.splice(i, 1);
        continue;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      const r = rStart + (stamps[i].rmax - rStart) * ease;
      const alpha = 1 - t * t;
      carveInk(ctx, stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha, stamps[i].color);
    }

    if (stamps.length) {
      requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
      if (isPaint) {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, dimsRef.current.w, dimsRef.current.h);
      }
    }
  }, [carveInk, mc, lifetime, rStart, isPaint, glow]);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // Keep trailing ink while the page scrolls under a stationary cursor.
  useEffect(() => {
    const onScroll = () => {
      const lc = lastClientRef.current;
      const canvas = canvasRef.current;
      if (!lc || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (lc.x < rect.left || lc.x > rect.right || lc.y < rect.top || lc.y > rect.bottom)
        return;
      stampAlong(lc.x - rect.left, lc.y - rect.top);
      startLoop();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stampAlong, startLoop]);

  const getRelativePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        cursor: isPaint ? "default" : "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        const pos = getRelativePos(e);
        lastPosRef.current = pos;
        lastClientRef.current = { x: e.clientX, y: e.clientY };
        stampAlong(pos.x, pos.y);
        startLoop();
      }}
      onMouseMove={(e) => {
        const pos = getRelativePos(e);
        lastClientRef.current = { x: e.clientX, y: e.clientY };
        stampAlong(pos.x, pos.y);
        startLoop();
      }}
      onMouseLeave={() => {
        lastPosRef.current = null;
        lastClientRef.current = null;
      }}
    />
  );
}
