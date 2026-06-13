import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Play,
  RotateCcw,
  Volume2,
  CalendarCheck,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Scripted call. The AI actually speaks aloud via the browser's
 * SpeechSynthesis API — no backend needed. Each line can trigger a
 * calendar action so the booking happens live during the call.
 * ------------------------------------------------------------------ */
type Action = "reveal" | "candidate" | "book" | undefined;
type Line = { from: "ai" | "caller"; text: string; action?: Action };

const script: Line[] = [
  {
    from: "ai",
    text: "Hi, thanks for calling Eweb! This is the AI receptionist. How can I help today?",
  },
  {
    from: "caller",
    text: "Hey, I'd like to book a consultation sometime this week.",
  },
  {
    from: "ai",
    text: "Happy to help. Let me pull up the calendar and find the best open time.",
    action: "reveal",
  },
  {
    from: "ai",
    text: "Tuesday and Wednesday are pretty full. Thursday at 2 PM is wide open — does that work?",
    action: "candidate",
  },
  { from: "caller", text: "Thursday at 2 is perfect." },
  {
    from: "ai",
    text: "Great, you're booked for Thursday at 2 PM and I'll text you a confirmation. Anything else?",
    action: "book",
  },
  { from: "caller", text: "That's everything, thanks!" },
  { from: "ai", text: "My pleasure. Talk soon!" },
];

/* ----------------------------- Calendar ---------------------------- */
const days = ["Tue", "Wed", "Thu", "Fri"];
const times = ["9:00", "10:30", "12:00", "2:00", "3:30"];

// Pre-existing meetings (day index, time index) -> short label
const busy: Record<string, string> = {
  "0-0": "Standup",
  "0-3": "Client",
  "1-1": "Design",
  "1-2": "Call",
  "3-0": "Review",
  "3-4": "1:1",
};
const CANDIDATE = "2-3"; // Thu, 2:00

function CalendarPanel({
  highlight,
  booked,
}: {
  highlight: boolean;
  booked: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/50 p-3">
      <div className="mb-2 flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <CalendarCheck className="size-3.5 text-brand-2" />
        Checking this week
      </div>
      <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-1 text-[10px]">
        <span />
        {days.map((d) => (
          <span key={d} className="pb-1 text-center font-medium text-muted-foreground">
            {d}
          </span>
        ))}

        {times.map((t, ti) => (
          <FragmentRow key={t} t={t} ti={ti} highlight={highlight} booked={booked} />
        ))}
      </div>
    </div>
  );
}

function FragmentRow({
  t,
  ti,
  highlight,
  booked,
}: {
  t: string;
  ti: number;
  highlight: boolean;
  booked: boolean;
}) {
  return (
    <>
      <span className="flex items-center pr-1 text-right text-muted-foreground/70">
        {t}
      </span>
      {days.map((_, di) => {
        const key = `${di}-${ti}`;
        const label = busy[key];
        const isCandidate = key === CANDIDATE;

        if (isCandidate) {
          return (
            <div
              key={key}
              className={`flex h-7 items-center justify-center rounded-md border text-[9px] font-semibold transition-all duration-500 ${
                booked
                  ? "border-brand/60 bg-brand/30 text-foreground"
                  : highlight
                    ? "animate-pulse border-brand/60 bg-brand/15 text-brand-2"
                    : "border-white/10 bg-white/[0.03] text-muted-foreground/40"
              }`}
            >
              {booked ? (
                <span className="flex items-center gap-0.5">
                  <Check className="size-2.5" /> You
                </span>
              ) : highlight ? (
                "Open"
              ) : (
                ""
              )}
            </div>
          );
        }

        return (
          <div
            key={key}
            className={`flex h-7 items-center justify-center rounded-md text-[9px] ${
              label
                ? "bg-white/[0.06] text-muted-foreground/70"
                : "bg-white/[0.02]"
            }`}
          >
            {label}
          </div>
        );
      })}
    </>
  );
}

/* ------------------------------ Demo ------------------------------- */
type Phase = "idle" | "active" | "done";

export function VoiceDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [idx, setIdx] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [candidate, setCandidate] = useState(false);
  const [booked, setBooked] = useState(false);
  const [supported, setSupported] = useState(true);

  const cancelRef = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      cancelRef.current = true;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const pickVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    const pool = en.length ? en : voices;
    const ai =
      pool.find((v) => /samantha|zira|aria|jenny|female|google us/i.test(v.name)) ||
      pool[0];
    const caller =
      pool.find(
        (v) => v !== ai && /david|guy|mark|male|daniel|fred/i.test(v.name),
      ) ||
      pool.find((v) => v !== ai) ||
      ai;
    return { ai, caller };
  };

  const runAction = (action: Action) => {
    if (action === "reveal") setShowCal(true);
    if (action === "candidate") {
      setShowCal(true);
      setCandidate(true);
    }
    if (action === "book") setBooked(true);
  };

  const playFrom = useCallback((i: number) => {
    if (cancelRef.current) return;
    if (i >= script.length) {
      setSpeaking(false);
      setPhase("done");
      setIdx(-1);
      return;
    }
    const line = script[i];
    setIdx(i);
    runAction(line.action);

    let advanced = false;
    const next = () => {
      if (advanced || cancelRef.current) return;
      advanced = true;
      setTimeout(() => playFrom(i + 1), 350);
    };

    const words = line.text.split(" ").length;
    const safety = words * 600 + 2500; // generous fallback if onend never fires

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(line.text);
      const { ai, caller } = pickVoices();
      const voice = line.from === "ai" ? ai : caller;
      if (voice) u.voice = voice;
      u.rate = 1;
      u.pitch = line.from === "ai" ? 1.1 : 0.9;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        next();
      };
      u.onerror = () => {
        setSpeaking(false);
        next();
      };
      window.speechSynthesis.speak(u);
      setTimeout(() => {
        if (!advanced) {
          setSpeaking(false);
          next();
        }
      }, safety);
    } else {
      // No speech support: fall back to timed captions.
      setSpeaking(true);
      setTimeout(() => {
        setSpeaking(false);
        next();
      }, safety);
    }
  }, []);

  const start = () => {
    cancelRef.current = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setShowCal(false);
    setCandidate(false);
    setBooked(false);
    setPhase("active");
    // Kick voices to load on some browsers, then start.
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    setTimeout(() => playFrom(0), 150);
  };

  const stop = () => {
    cancelRef.current = true;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setPhase("idle");
    setIdx(-1);
    setShowCal(false);
    setCandidate(false);
    setBooked(false);
  };

  const line = idx >= 0 ? script[idx] : null;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="accent-glow pointer-events-none absolute -inset-6 -z-0 rounded-[2.5rem] opacity-40 blur-2xl"
      />
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-5 backdrop-blur-xl">
        {/* Call header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="relative grid size-11 place-items-center rounded-full bg-brand/15 text-brand-2">
            {phase === "active" && (
              <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
            )}
            <PhoneCall className="relative size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Eweb AI Receptionist</p>
            <p className="text-xs text-muted-foreground">
              {phase === "idle" && "Tap to hear a live call"}
              {phase === "active" && "On call · live"}
              {phase === "done" && "Call ended"}
            </p>
          </div>
          {/* Live waveform */}
          <span className="flex h-6 items-end gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-brand-2/80 transition-all duration-150"
                style={{
                  height: speaking ? `${6 + ((i * 7 + 9) % 16)}px` : "4px",
                  animation: speaking
                    ? `wave 0.6s ease-in-out ${i * 0.08}s infinite alternate`
                    : "none",
                }}
              />
            ))}
          </span>
        </div>

        {/* Live caption */}
        <div className="min-h-[120px] py-4" aria-live="polite">
          <AnimatePresence mode="wait">
            {line ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={
                  line.from === "ai"
                    ? "ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-brand/20 px-3.5 py-2.5 text-sm text-foreground"
                    : "mr-auto max-w-[88%] rounded-2xl rounded-bl-sm bg-white/5 px-3.5 py-2.5 text-sm text-muted-foreground"
                }
              >
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider opacity-60">
                  {line.from === "ai" ? "AI receptionist" : "Caller"}
                </span>
                {line.text}
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                {phase === "done"
                  ? "That's how every call goes — answered, handled, booked."
                  : "Press play and turn your sound on to hear the AI take a call and book a meeting."}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Calendar reveal */}
        <AnimatePresence>
          {showCal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <CalendarPanel highlight={candidate} booked={booked} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result chip */}
        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-xl border border-brand/25 bg-brand/10 px-3.5 py-2.5 text-sm"
            >
              <CalendarCheck className="size-4 text-brand-2" />
              <span className="font-medium">Appointment booked</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Thu · 2:00 PM
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-2">
          {phase === "idle" && (
            <button
              onClick={start}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5 hover:shadow-white/25"
            >
              <Play className="size-4 fill-current" />
              Start the call
            </button>
          )}
          {phase === "active" && (
            <button
              onClick={stop}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-white/30 hover:bg-white/10"
            >
              <PhoneOff className="size-4" />
              End call
            </button>
          )}
          {phase === "done" && (
            <button
              onClick={start}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5 hover:shadow-white/25"
            >
              <RotateCcw className="size-4" />
              Replay the call
            </button>
          )}
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          {supported ? (
            <>
              <Volume2 className="size-3" />
              Plays real audio — turn your sound on
            </>
          ) : (
            <>
              <Phone className="size-3" />
              Live captions (your browser blocks demo audio)
            </>
          )}
        </p>
      </div>
    </div>
  );
}
