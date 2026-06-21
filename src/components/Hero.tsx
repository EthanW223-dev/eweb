import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Navbar } from "./Navbar";
import { WebsiteShowcase } from "./WebsiteShowcase";
import ASCIIText from "./ASCIIText";
import AsciiPlasma from "./backgrounds/AsciiPlasma";
import { Mainframe } from "./Mainframe";

const HERO_BG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85";

const GRASS =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png";

const DESIGN_WIDTH = 896;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function ScaledDashboard({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const next = Math.min(1, outer.offsetWidth / DESIGN_WIDTH);
      setScale(next);
      setHeight(inner.offsetHeight * next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} style={{ height }} className="overflow-hidden">
      <div
        ref={innerRef}
        style={{ width: DESIGN_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The scroll IS the transition. For buttery-smooth motion we DON'T re-render
  // React every frame — the rAF loop eases `progress` and writes the animated
  // styles straight to the DOM via refs. React only re-renders on the few
  // discrete changes (started / shader mount / expanded).
  const [expanded, setExpanded] = useState(false);
  const [shaderOn, setShaderOn] = useState(false);
  const [started, setStarted] = useState(false);

  const targetRef = useRef(0);
  const progressRef = useRef(0);
  const expandedRef = useRef(false);
  const shaderOnRef = useRef(false);
  const startedRef = useRef(false);
  const touchStartY = useRef(0);
  const isMobileRef = useRef(false);
  isMobileRef.current = isMobile;

  // Animated elements — styled directly each frame (no re-render).
  const asciiRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const grassRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const shaderWrapRef = useRef<HTMLDivElement>(null);
  const shaderTimeRef = useRef(0);

  const applyStyles = useCallback((p: number) => {
    const isM = isMobileRef.current;
    const popT = clamp(p / 0.24, 0, 1);
    const asciiOpacity = clamp(1 - popT * 1.4, 0, 1);
    const blackT = clamp((p - 0.2) / 0.14, 0, 1);
    const shaderProg = clamp((p - 0.18) / 0.42, 0, 1);
    const shaderOpacity =
      clamp((p - 0.18) / 0.12, 0, 1) * (1 - clamp((p - 0.5) / 0.12, 0, 1));
    const zoomT = clamp((p - 0.56) / 0.44, 0, 1);
    const grassOpacity = 1 - clamp((p - 0.54) / 0.24, 0, 1);
    const navOpacity = clamp(1 - p * 2.4, 0, 1);
    shaderTimeRef.current = shaderProg * 4;

    if (asciiRef.current) asciiRef.current.style.opacity = `${asciiOpacity}`;
    if (boxRef.current)
      boxRef.current.style.transform = `translateY(${
        (isM ? 38 : 42) - popT * (isM ? 48 : 52)
      }vh) scale(${1 + zoomT * 2.6})`;
    if (blackRef.current) blackRef.current.style.opacity = `${blackT}`;
    if (grassRef.current) grassRef.current.style.opacity = `${grassOpacity}`;
    if (shaderWrapRef.current) shaderWrapRef.current.style.opacity = `${shaderOpacity}`;
    if (cueRef.current) cueRef.current.style.opacity = `${clamp(1 - p * 6, 0, 1)}`;
    if (navRef.current) {
      navRef.current.style.opacity = `${navOpacity}`;
      navRef.current.style.pointerEvents = navOpacity < 0.05 ? "none" : "";
    }
  }, []);

  // Smooth ease loop — direct DOM writes, minimal state changes.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = targetRef.current;
      const cur = progressRef.current;
      const next = Math.abs(target - cur) < 0.0004 ? target : cur + (target - cur) * 0.1;
      progressRef.current = next;
      applyStyles(next);

      if (next > 0.02 !== startedRef.current) {
        startedRef.current = next > 0.02;
        setStarted(startedRef.current);
      }
      const shaderShould = next > 0.16 && next < 0.62;
      if (shaderShould !== shaderOnRef.current) {
        shaderOnRef.current = shaderShould;
        setShaderOn(shaderShould);
      }
      const shouldExpand = next >= 0.97;
      if (shouldExpand !== expandedRef.current) {
        expandedRef.current = shouldExpand;
        setExpanded(shouldExpand);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyStyles]);

  // Re-apply after any re-render (refs reattach when the stage remounts).
  useEffect(() => {
    applyStyles(progressRef.current);
  });

  // Wheel / touch set the TARGET (the loop eases toward it).
  useEffect(() => {
    const bump = (delta: number) => {
      targetRef.current = clamp(targetRef.current + delta, 0, 1);
    };
    const handleWheel = (e: WheelEvent) => {
      if (expandedRef.current && !(e.deltaY < 0 && window.scrollY <= 5)) return;
      e.preventDefault();
      bump(e.deltaY * 0.0016);
    };
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      if (expandedRef.current && !(deltaY < 0 && window.scrollY <= 5)) return;
      e.preventDefault();
      bump(deltaY * 0.0038);
      touchStartY.current = touchY;
    };
    const handleTouchEnd = () => {
      touchStartY.current = 0;
    };
    const handleScroll = () => {
      if (!expandedRef.current) window.scrollTo(0, 0);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative">
      {!expanded && (
        <div ref={navRef} className="fixed inset-x-0 top-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Phase 1 — fixed transition stage (isolated). Unmounts when expanded. */}
      {!expanded && (
        <div className="fixed inset-0 z-30 overflow-hidden isolate">
          {/* Sky */}
          <div
            aria-hidden="true"
            style={{ backgroundImage: `url(${HERO_BG})` }}
            className="absolute inset-x-0 -top-[6%] z-0 h-[112%] bg-cover bg-center"
          />

          {/* ASCII "Eweb" — covered by the rising website */}
          <div
            ref={asciiRef}
            className="pointer-events-none absolute inset-x-0 top-[15%] z-10 flex justify-center px-5"
          >
            <div className="relative h-[160px] w-full max-w-5xl sm:h-[320px] lg:h-[380px]">
              <ASCIIText
                text="Eweb"
                enableWaves={true}
                asciiFontSize={isMobile ? 4 : 8}
                planeBaseHeight={12}
              />
            </div>
          </div>

          {/* The website box: starts BEHIND the grass, pops straight up (same
              size) to cover "Eweb", turns black while the shader plays over it
              (scroll-scrubbed), then zooms in to cover the screen in black. */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div
              ref={boxRef}
              style={{
                transform: `translateY(${isMobile ? 38 : 42}vh)`,
                transformOrigin: "center center",
              }}
              className="relative w-[94%] max-w-4xl overflow-hidden rounded-t-2xl bg-black shadow-[0_-20px_80px_rgba(0,0,0,0.35)] sm:w-[86%] lg:w-[74%]"
            >
              {/* The rotating Eweb website */}
              <div className="relative z-10">
                <ScaledDashboard>
                  <WebsiteShowcase frozen={started} />
                </ScaledDashboard>
              </div>
              {/* The website turns to black */}
              <div
                ref={blackRef}
                aria-hidden="true"
                style={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-20 bg-black"
              />
              {/* The plasma reveal rendered as colorful ASCII (Eweb texture),
                  scroll-scrubbed; then fades to solid black. */}
              <div
                ref={shaderWrapRef}
                aria-hidden="true"
                style={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-30"
              >
                {shaderOn && <AsciiPlasma timeRef={shaderTimeRef} />}
              </div>
            </div>
          </div>

          {/* Grass foreground (z-30) — the website hides BEHIND it at rest and
              rises out of it as you scroll; fades as the black zoom covers all */}
          <img
            ref={grassRef}
            src={GRASS}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 z-30 w-[230%] max-w-none -translate-x-1/2 select-none sm:left-0 sm:w-full sm:translate-x-0"
          />

          {/* Scroll cue */}
          <div
            ref={cueRef}
            className="pointer-events-none absolute bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 text-gray-800 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <span className="text-[11px] font-medium uppercase tracking-widest">
                Scroll to explore
              </span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* After the transition, the Mainframe page cross-fades up from the black
          (mounted only then, so its typewriter / pill animations play). */}
      {expanded && (
        <>
          <div className="fixed inset-0 z-0 bg-black" />
          <div className="mainframe-in relative z-10">
            <Mainframe />
          </div>
        </>
      )}
    </div>
  );
}
