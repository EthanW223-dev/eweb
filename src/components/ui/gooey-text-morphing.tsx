"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const t1 = text1Ref.current;
    const t2 = text2Ref.current;
    if (!t1 || !t2 || texts.length === 0) return;

    const n = texts.length;
    let current = 0; // index of the word currently shown (held in t1)
    let phase: "hold" | "morph" = "hold";
    let elapsed = 0; // seconds spent in the current phase
    let last = performance.now();
    let raf = 0;

    // t1 = current word, t2 = next word.
    const syncText = () => {
      t1.textContent = texts[current % n];
      t2.textContent = texts[(current + 1) % n];
    };

    // Steady state: current word crisp, next word hidden.
    const showHold = () => {
      t1.style.filter = "";
      t1.style.opacity = "100%";
      t2.style.filter = "";
      t2.style.opacity = "0%";
    };

    // fraction 0 -> 1 : t1 (current) blurs/fades out, t2 (next) sharpens/fades in.
    const setMorph = (fraction: number) => {
      t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inv = 1 - fraction;
      t1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      t1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    syncText();
    showHold();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      // Clamp dt so a slow/background frame can't make the morph jump.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += dt;

      if (phase === "hold") {
        if (elapsed >= cooldownTime) {
          phase = "morph";
          elapsed = 0;
        } else {
          showHold();
          return;
        }
      }

      // phase === "morph"
      let fraction = elapsed / morphTime;
      if (fraction >= 1) {
        // Morph complete: advance to the next word and settle.
        setMorph(1);
        current = (current + 1) % n;
        syncText();
        showHold();
        phase = "hold";
        elapsed = 0;
      } else {
        setMorph(Math.max(fraction, 0.0001));
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="flex items-center justify-center"
        style={{ filter: "url(#threshold)" }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block select-none text-center text-6xl md:text-[60pt]",
            "text-foreground",
            textClassName
          )}
        />
        <span
          ref={text2Ref}
          className={cn(
            "absolute inline-block select-none text-center text-6xl md:text-[60pt]",
            "text-foreground",
            textClassName
          )}
        />
      </div>
    </div>
  );
}
