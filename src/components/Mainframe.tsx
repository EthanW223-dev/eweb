import { useEffect, useRef, useState } from "react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";
const EMAIL = "hello@mainframe.co";
const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"];
const TYPED =
  "Glad you stopped in. Good taste tends to find us. Now, what are we building?";

/** Reveals `text` one character at a time after `startDelay`. */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="1.5" y="1.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function Mainframe() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const { displayed, done } = useTypewriter(TYPED);

  // Pills appear 400ms after load, independent of the typewriter.
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Horizontal mouse movement scrubs the background video.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const SENSITIVITY = 0.8;
    let prevX: number | null = null;
    let targetTime = 0;
    let seeking = false;

    const seek = () => {
      if (!video.duration) return;
      seeking = true;
      video.currentTime = targetTime;
    };
    const onMove = (e: MouseEvent) => {
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      if (!video.duration) return;
      targetTime = Math.min(
        Math.max(targetTime + (delta / window.innerWidth) * SENSITIVITY * video.duration, 0),
        video.duration,
      );
      if (!seeking) seek();
    };
    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.01) seek();
      else seeking = false;
    };

    window.addEventListener("mousemove", onMove);
    video.addEventListener("seeked", onSeeked);
    return () => {
      window.removeEventListener("mousemove", onMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL);
  };

  return (
    <div className="relative min-h-screen text-black" style={{ fontFamily: "var(--font-body)" }}>
      {/* Background video — scrubbed by horizontal mouse movement */}
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
      />

      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] tracking-tight text-black sm:text-[26px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mainframe&reg;
          </span>
          <span
            className="select-none text-[25px] text-black sm:text-[30px]"
            style={{ letterSpacing: "-0.02em" }}
          >
            &#10035;&#xFE0E;
          </span>
        </div>

        <div className="hidden items-center text-[23px] text-black md:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link}>
              <a href="#" className="transition-opacity hover:opacity-60">
                {link}
              </a>
              {i < NAV_LINKS.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>

        <a
          href="#"
          className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Get in touch
        </a>

        {/* Hamburger */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-[5px] md:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-black transition-transform duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-black transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-black transition-transform duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a key={link} href="#" className="text-[32px] font-medium text-black">
            {link}
          </a>
        ))}
        <a href="#" className="text-[32px] font-medium text-black underline">
          Get in touch
        </a>
      </div>

      {/* Hero */}
      <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none mb-5 select-none sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              filter: "blur(4px)",
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* Typewriter */}
          <p
            className="mb-5 text-black sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: 54,
            }}
          >
            {displayed}
            {!done && (
              <span
                className="ml-[2px] inline-block h-[1.1em] w-[2px] bg-black align-middle"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          {/* Action pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {["Pitch us an idea", "Come work here", "Send a brief hello", "See how we operate"].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
                >
                  {label}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span>
                Reach us:{" "}
                <span className="underline underline-offset-1">{EMAIL}</span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
