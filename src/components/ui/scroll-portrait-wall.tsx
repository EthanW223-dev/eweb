"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WallItem {
  name: string;
  role: string;
  /** Image URL. Square / portrait crops look best. */
  src?: string;
  /** Custom cell content (overrides `src`) — e.g. a rendered landing page. */
  content?: React.ReactNode;
}

/** @deprecated kept for backwards compat — use {@link WallItem}. */
export type Speaker = WallItem;

export interface ScrollPortraitWallProps {
  /** Big sticky title rendered with `mix-blend-exclusion`. */
  title?: React.ReactNode;
  /** Small line under the title. */
  date?: React.ReactNode;
  /** Scroll hint that fades out as the wall comes into view. */
  hint?: React.ReactNode;
  /** Items to scatter across the wall. */
  speakers?: WallItem[];
  /** Columns on large screens (auto-reduced to 3 on `sm` and 2 on mobile). */
  columns?: number;
  /** Show the name / role caption under each cell. Default `true`. */
  showCaptions?: boolean;
  /** Decorative background layer rendered behind the cells (e.g. dots / ink). */
  background?: React.ReactNode;
  className?: string;
}

/* Deterministic placement so SSR and client agree (no Math.random):
 * one item per row, with every third row holding a second one,
 * columns walked in a scattered pattern. Returns a grid of item
 * indices (or -1 for an empty cell). */
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let i = 0;
  let r = 0;
  while (i < count) {
    const row = new Array<number>(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = i++;
    if (r % 3 === 0 && i < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = i++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

/* Keep cells a usable size: cap the desired column count on smaller
 * viewports. Starts from `desired` so the SSR markup matches the first
 * client render, then narrows after mount. */
function useResponsiveColumns(desired: number): number {
  const [cols, setCols] = React.useState(desired);

  React.useEffect(() => {
    const sm = window.matchMedia("(min-width: 640px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      if (lg.matches) setCols(desired);
      else if (sm.matches) setCols(Math.min(desired, 3));
      else setCols(Math.min(desired, 2));
    };
    update();
    sm.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      sm.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, [desired]);

  return cols;
}

export function ScrollPortraitWall({
  title = "Speakers",
  date,
  hint = "scroll down to see effect",
  speakers = [],
  columns = 4,
  showCaptions = true,
  background,
  className,
}: ScrollPortraitWallProps) {
  const root = React.useRef<HTMLElement | null>(null);
  const hintRef = React.useRef<HTMLDivElement | null>(null);
  const cols = useResponsiveColumns(Math.max(1, columns));
  const layout = React.useMemo(
    () => buildLayout(speakers.length, cols),
    [speakers.length, cols],
  );

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = gsap.utils.toArray<HTMLElement>(".spw-item");

      if (reduce) {
        gsap.set(items, { scale: 1 });
        return;
      }

      // Hint fades away over the first stretch of scrolling.
      gsap.to(hintRef.current, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=40%",
          scrub: true,
        },
      });

      // Each cell scrubs scale 0 → 1 → 0 across its full pass through the
      // viewport: it grows in from its transform-origin corner, peaks at
      // centre, then shrinks away — "comes and goes".
      items.forEach((el) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          })
          .fromTo(
            el,
            { scale: 0 },
            { scale: 1, ease: "power2.out", duration: 0.5 },
          )
          .to(el, { scale: 0, ease: "power2.in", duration: 0.5 });
      });
    },
    { scope: root, dependencies: [cols], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      aria-label={typeof title === "string" ? title : undefined}
      className={cn("relative w-full bg-background text-foreground", className)}
    >
      {/* Decorative background (dots / ink) behind the cells */}
      {background && <div className="absolute inset-0 z-0">{background}</div>}

      {/* Scroll hint, lower-centre of the first screen, fading on scroll */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute left-1/2 top-[60vh] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center"
      >
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-60 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-current/30 after:content-['']">
          {hint}
        </span>
      </div>

      {/* Sticky centred title — inverts against whatever cell is behind it */}
      <div className="pointer-events-none sticky top-1/2 z-20 flex -translate-y-1/2 flex-col items-center text-center text-white mix-blend-exclusion">
        {typeof title === "string" ? (
          <h2 className="text-5xl font-semibold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
            {title}
          </h2>
        ) : (
          title
        )}
        {date && (
          <p className="mt-1 text-xs uppercase tracking-wide text-white/60 sm:text-sm">
            {date}
          </p>
        )}
      </div>

      {/* The scattered grid */}
      <div className="relative z-10 mb-[50vh] mt-[50vh]">
        {layout.map((row, ri) => (
          <div key={ri} className="flex w-full">
            {row.map((idx, ci) => {
              if (idx === -1)
                return <div key={ci} className="aspect-square flex-1" />;

              const s = speakers[idx];
              const origin = ci < cols / 2 ? "right bottom" : "left bottom";

              return (
                <div key={ci} className="aspect-square flex-1">
                  <div
                    className="spw-item relative h-full w-full"
                    style={{ transformOrigin: origin, transform: "scale(0)" }}
                  >
                    {s.content ? (
                      s.content
                    ) : (
                      <img
                        src={s.src}
                        alt={s.name}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-cover grayscale contrast-[1.15] filter transition-transform duration-500 ease-in-out hover:scale-95"
                      />
                    )}
                    {showCaptions && (
                      <div className="absolute -bottom-2 left-0 flex w-full translate-y-full justify-between gap-2 text-[11px] uppercase leading-tight opacity-70 sm:text-sm">
                        <span className="truncate">{s.name}</span>
                        <span className="shrink-0">({s.role})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScrollPortraitWall;
