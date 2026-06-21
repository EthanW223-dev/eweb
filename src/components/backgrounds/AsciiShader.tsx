// @ts-nocheck
import { useEffect, useRef } from "react";

/**
 * A scroll-scrubbed ASCII rain that echoes the "Eweb" wordmark: a mix of
 * letters, numbers and symbols in varied colors. Deterministic on
 * `timeRef.current`, so scrolling a little advances it a little (and scrubs
 * back cleanly).
 */
const CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>[]{}/\\=+*#%&@$?!".split("");
// Colorful palette to match the multi-colored Eweb title.
const PALETTE = ["#22d3ee", "#34d399", "#a78bfa", "#ec4899", "#f59e0b", "#60a5fa"];

export default function AsciiShader({
  className = "",
  timeRef,
}: {
  className?: string;
  timeRef?: { current: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 15;
    const charW = 11;
    let cols = 0;
    let rows = 0;
    let speeds: number[] = [];
    let offsets: number[] = [];
    let colColor: string[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / charW);
      rows = Math.ceil(h / fontSize) + 2;
      speeds = [];
      offsets = [];
      colColor = [];
      for (let i = 0; i < cols; i++) {
        speeds.push(0.6 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 1.6);
        offsets.push((Math.sin(i * 78.233) * 0.5 + 0.5) * rows);
        colColor.push(PALETTE[Math.floor((Math.sin(i * 45.13) * 0.5 + 0.5) * PALETTE.length) % PALETTE.length]);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const startTime = Date.now();
    // Deterministic glyph from cell + flip-frame (so scrubbing is stable).
    const glyphAt = (x: number, y: number, f: number) => {
      const v = Math.sin(x * 92.13 + y * 41.7 + f * 1.7) * 0.5 + 0.5;
      return CHARS[Math.floor(v * CHARS.length) % CHARS.length];
    };

    const tail = 18;

    const render = () => {
      const t = timeRef ? timeRef.current : (Date.now() - startTime) * 0.001;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#050008";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textBaseline = "top";

      const span = rows + tail;
      const flip = Math.floor(t * 4);
      for (let x = 0; x < cols; x++) {
        const head = (offsets[x] + t * 9 * speeds[x]) % span;
        for (let y = 0; y < rows; y++) {
          const dist = (head - y + span) % span; // rows below the head
          if (dist >= tail) continue;
          const alpha = 1 - dist / tail;
          if (alpha <= 0.03) continue;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = dist < 1 ? "#ffffff" : colColor[x];
          ctx.fillText(glyphAt(x, y, flip + (dist < 1 ? 1 : 0)), x * charW, y * fontSize);
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />;
}
