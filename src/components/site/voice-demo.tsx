import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PhoneOff,
  PhoneCall,
  Mic,
  Play,
  RotateCcw,
  Volume2,
  CalendarCheck,
  Check,
  Loader2,
} from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  }
}

/* ----------------------------- Calendar ---------------------------- */
const days = ["Tue", "Wed", "Thu", "Fri"];
const times = ["9:00", "10:30", "12:00", "2:00", "3:30"];
const busy: Record<string, string> = {
  "0-0": "Standup",
  "0-3": "Client",
  "1-1": "Design",
  "1-2": "Call",
  "3-0": "Review",
  "3-4": "1:1",
};
const DEFAULT_SLOT = "2-3"; // Thu, 2:00

const slotLabel = (key: string) => {
  const [d, t] = key.split("-").map(Number);
  const time = times[t];
  const period = t >= 2 ? "PM" : "AM";
  return `${["Tuesday", "Wednesday", "Thursday", "Friday"][d]} at ${time} ${period}`;
};
const isFree = (key: string) => !busy[key];

function parseSlot(t: string): string | null {
  const day = /tues/i.test(t)
    ? 0
    : /wed/i.test(t)
      ? 1
      : /thu/i.test(t)
        ? 2
        : /fri/i.test(t)
          ? 3
          : -1;
  const time = /(10[:.]?30|ten[- ]?thirty)/i.test(t)
    ? 1
    : /(3[:.]?30|three[- ]?thirty)/i.test(t)
      ? 4
      : /(\b9\b|nine)/i.test(t)
        ? 0
        : /(12|noon|twelve)/i.test(t)
          ? 2
          : /(\b2\b|two)/i.test(t)
            ? 3
            : -1;
  if (day >= 0 && time >= 0) return `${day}-${time}`;
  return null;
}

function CalendarPanel({
  slot,
  highlight,
  booked,
}: {
  slot: string;
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
          <Row key={t} t={t} ti={ti} slot={slot} highlight={highlight} booked={booked} />
        ))}
      </div>
    </div>
  );
}

function Row({
  t,
  ti,
  slot,
  highlight,
  booked,
}: {
  t: string;
  ti: number;
  slot: string;
  highlight: boolean;
  booked: boolean;
}) {
  return (
    <>
      <span className="flex items-center pr-1 text-right text-muted-foreground/70">{t}</span>
      {days.map((_, di) => {
        const key = `${di}-${ti}`;
        const label = busy[key];
        const isPick = key === slot;

        if (isPick) {
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
              label ? "bg-white/[0.06] text-muted-foreground/70" : "bg-white/[0.02]"
            }`}
          >
            {label}
          </div>
        );
      })}
    </>
  );
}

/* --------------------------- Sample call --------------------------- */
const sample: { from: "ai" | "caller"; text: string; act?: "reveal" | "pick" | "book" }[] = [
  { from: "ai", text: "Hey, thanks for calling Eweb! This is Riley, the AI receptionist — how can I help you out today?" },
  { from: "caller", text: "Hi! I've been meaning to book a consultation this week." },
  { from: "ai", text: "Love it — let me pull up the calendar and find you the best time.", act: "reveal" },
  { from: "ai", text: "Looks like Thursday at 2 is wide open. Want me to grab that for you?", act: "pick" },
  { from: "caller", text: "Yeah, Thursday at 2 is perfect." },
  { from: "ai", text: "You're all set for Thursday at 2 — I'll shoot you a text to confirm. Anything else?", act: "book" },
  { from: "caller", text: "Nope, that's everything. Thanks!" },
  { from: "ai", text: "My pleasure — thanks for calling Eweb. Talk soon!" },
];

/* ------------------------------ Intent ----------------------------- */
const YES = /\b(yes|yeah|yep|yup|sure|ok|okay|sounds good|perfect|book it|that works|works|great|please|do it|confirm|go ahead)\b/i;
const NO = /\b(no|nope|nah|another|different|else|other|can'?t|cannot)\b/i;
const DONE = /\b(that'?s all|that'?s it|nothing|no thanks|all good|i'?m good|we'?re good|done)\b/i;

const getSR = (): (new () => unknown) | null => {
  if (typeof window === "undefined") return null;
  return (window.SpeechRecognition || window.webkitSpeechRecognition || null) as
    | (new () => unknown)
    | null;
};

/* Lazily load Puter.js — a free, no-API-key service that gives us lifelike
 * neural (Amazon Polly) voices in the browser. Loaded only when the demo
 * starts, never blocks, and we always fall back to built-in speech. */
let puterLoading: Promise<void> | null = null;
function loadPuter(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as { puter?: { ai?: { txt2speech?: unknown } } };
  if (w.puter?.ai?.txt2speech) return Promise.resolve();
  if (puterLoading) return puterLoading;
  puterLoading = new Promise<void>((resolve) => {
    const done = () => resolve();
    const existing = document.getElementById("puter-js");
    if (existing) {
      existing.addEventListener("load", done);
      setTimeout(done, 4000);
      return;
    }
    const s = document.createElement("script");
    s.id = "puter-js";
    s.src = "https://js.puter.com/v2/";
    s.async = true;
    s.onload = done;
    s.onerror = done;
    document.head.appendChild(s);
    setTimeout(done, 4000); // never hang the demo waiting on a 3rd party
  });
  return puterLoading;
}

/* Probe whether the server-side ElevenLabs proxy (/api/tts) is configured.
 * Cached after the first check. In local dev (no serverless) this resolves
 * false, so the demo uses free Polly voices. */
let elevenReady: boolean | null = null;
async function checkEleven(): Promise<boolean> {
  if (elevenReady !== null) return elevenReady;
  try {
    const r = await fetch("/api/tts?ping=1");
    const j = await r.json();
    elevenReady = !!(j && j.eleven);
  } catch {
    elevenReady = false;
  }
  return elevenReady;
}

function getPuterTTS():
  | ((t: string, opts: { voice: string; engine: string; language: string }) => Promise<HTMLAudioElement>)
  | null {
  const w = window as unknown as {
    puter?: {
      ai?: {
        txt2speech?: (
          t: string,
          opts: { voice: string; engine: string; language: string },
        ) => Promise<HTMLAudioElement>;
      };
    };
  };
  return w.puter?.ai?.txt2speech ?? null;
}

// Amazon Polly "generative" voices sound the most human (conversational, with
// natural intonation). We try generative first, then fall back to neural.
function puterSpeak(
  text: string,
  who: "ai" | "caller",
  engine: string,
): Promise<HTMLAudioElement> | null {
  const fn = getPuterTTS();
  if (!fn) return null;
  return fn(text, {
    voice: who === "ai" ? "Joanna" : "Matthew",
    engine,
    language: "en-US",
  });
}

type Phase = "idle" | "live" | "sample" | "done";
type Conv = "need" | "confirm" | "wrap" | "ended";
type Status = "" | "greeting" | "listening" | "thinking" | "speaking";

export function VoiceDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState<Status>("");
  const [conv, setConv] = useState<Conv>("need");
  const [aiText, setAiText] = useState<string>("");
  const [userText, setUserText] = useState<string>("");
  const [showCal, setShowCal] = useState(false);
  const [slot, setSlot] = useState(DEFAULT_SLOT);
  const [highlight, setHighlight] = useState(false);
  const [booked, setBooked] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micError, setMicError] = useState<"" | "denied" | "unsupported">("");

  const cancelRef = useRef(false);
  const convRef = useRef<Conv>("need");
  const recRef = useRef<{ abort: () => void; start: () => void } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setConvState = (c: Conv) => {
    convRef.current = c;
    setConv(c);
  };

  const est = (text: string) => Math.max(1600, text.split(" ").length * 360) + 900;

  // Fallback voice picker — prefer the most natural built-in voice available
  // (Edge/Chrome expose cloud "Natural"/"Online" neural voices for free).
  const pickVoice = (who: "ai" | "caller") => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    const pool = en.length ? en : voices;
    const score = (v: SpeechSynthesisVoice) => {
      let s = 0;
      if (/natural|neural|online|premium|enhanced/i.test(v.name)) s += 6;
      if (/google/i.test(v.name)) s += 3;
      if (!v.localService) s += 2;
      if (/aria|jenny|libby|sonia|samantha|joanna|emma/i.test(v.name)) s += 1;
      return s;
    };
    const ranked = [...pool].sort((a, b) => score(b) - score(a));
    const ai = ranked[0];
    if (who === "ai") return ai;
    return (
      ranked.find((v) => v !== ai && /guy|matthew|david|mark|brian|daniel|male/i.test(v.name)) ||
      ranked.find((v) => v !== ai) ||
      ai
    );
  };

  const reset = () => {
    setShowCal(false);
    setHighlight(false);
    setBooked(false);
    setSlot(DEFAULT_SLOT);
    setUserText("");
    setAiText("");
  };

  // Speak a line as humanly as possible: try Polly "generative" (most natural),
  // then "neural", then the best built-in browser voice. Resolve when finished.
  const say = (text: string, who: "ai" | "caller" = "ai") =>
    new Promise<void>((resolve) => {
      setAiText(text);
      setStatus("speaking");
      setSpeaking(true);
      let done = false;
      let playingOk = false;
      const fin = () => {
        if (done) return;
        done = true;
        setSpeaking(false);
        resolve();
      };

      const webSpeak = () => {
        const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
        if (!synth) {
          setTimeout(fin, est(text));
          return;
        }
        const u = new SpeechSynthesisUtterance(text);
        const v = pickVoice(who);
        if (v) u.voice = v;
        u.rate = 0.98;
        u.pitch = who === "ai" ? 1.05 : 0.95;
        u.onend = fin;
        u.onerror = fin;
        synth.cancel();
        synth.speak(u);
        setTimeout(fin, est(text) + 2000);
      };

      // Try each Polly engine in order of human-ness, then browser speech.
      const engines = ["generative", "neural"];
      const tryEngine = (i: number) => {
        if (done) return;
        if (cancelRef.current) {
          fin();
          return;
        }
        if (i >= engines.length) {
          webSpeak();
          return;
        }
        let p: Promise<HTMLAudioElement> | null = null;
        try {
          p = puterSpeak(text, who, engines[i]);
        } catch {
          p = null;
        }
        if (!p) {
          webSpeak();
          return;
        }
        p.then((audio) => {
          if (cancelRef.current) {
            fin();
            return;
          }
          audioRef.current = audio;
          audio.onplaying = () => {
            playingOk = true;
          };
          audio.onended = fin;
          // Only fall back if playback never actually started.
          audio.onerror = () => {
            if (!playingOk) tryEngine(i + 1);
          };
          const play = audio.play();
          if (play && typeof play.catch === "function") play.catch(() => tryEngine(i + 1));
          setTimeout(fin, est(text) + 7000); // safety if audio stalls
        }).catch(() => tryEngine(i + 1));
      };

      // Most human first: ElevenLabs (server proxy) → Polly engines → browser.
      if (elevenReady && !cancelRef.current) {
        const audio = new Audio(`/api/tts?who=${who}&text=${encodeURIComponent(text)}`);
        audioRef.current = audio;
        audio.onplaying = () => {
          playingOk = true;
        };
        audio.onended = fin;
        audio.onerror = () => {
          if (!playingOk) tryEngine(0);
        };
        const play = audio.play();
        if (play && typeof play.catch === "function") play.catch(() => tryEngine(0));
        setTimeout(fin, est(text) + 9000);
      } else {
        tryEngine(0);
      }
    });

  /* ----------------------- Live conversation ----------------------- */
  const listen = useCallback(() => {
    if (cancelRef.current || convRef.current === "ended") return;
    if (micError) return; // fall back to tap-to-reply chips
    const SR = getSR();
    if (!SR) {
      setMicError("unsupported");
      return;
    }
    setStatus("listening");
    let finalText = "";
    const rec = new SR() as {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      continuous: boolean;
      start: () => void;
      abort: () => void;
      onresult: (e: { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] }) => void;
      onerror: (e: { error: string }) => void;
      onend: () => void;
    };
    recRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e) => {
      let interim = "";
      finalText = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setUserText(finalText || interim);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setMicError("denied");
    };
    rec.onend = () => {
      const t = finalText.trim();
      if (t && !cancelRef.current) handleUser(t);
    };
    try {
      rec.start();
    } catch {
      /* already started */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micError]);

  const handleUser = async (t: string) => {
    if (cancelRef.current) return;
    recRef.current?.abort();
    setUserText(t);
    setStatus("thinking");
    const s = convRef.current;

    if (s === "need") {
      const requested = parseSlot(t);
      if (requested && isFree(requested)) {
        setShowCal(true);
        setSlot(requested);
        setHighlight(true);
        setConvState("confirm");
        await say(`Nice, ${slotLabel(requested)} is open — want me to grab that for you?`);
        listen();
        return;
      }
      setShowCal(true);
      setSlot(DEFAULT_SLOT);
      setHighlight(true);
      setConvState("confirm");
      await say("Sure thing — let me take a peek at the calendar. Looks like Thursday at 2 is wide open. Want me to grab it for you?");
      listen();
      return;
    }

    if (s === "confirm") {
      const requested = parseSlot(t);
      if (requested && isFree(requested) && (!NO.test(t) || YES.test(t))) {
        setSlot(requested);
        setHighlight(true);
        setBooked(true);
        setConvState("wrap");
        await say(`Perfect, you're all set for ${slotLabel(requested)} — I'll shoot you a text to confirm. Anything else I can help with?`);
        listen();
        return;
      }
      if (YES.test(t) && !NO.test(t)) {
        setBooked(true);
        setConvState("wrap");
        await say(`Awesome, you're all set for ${slotLabel(slot)} — I'll text you a confirmation. Anything else I can help with?`);
        listen();
        return;
      }
      if (NO.test(t)) {
        setSlot("3-1");
        setHighlight(true);
        await say("No worries — I've also got Friday at 10:30. Does that work better?");
        listen();
        return;
      }
      await say("Sorry, I didn't quite catch that — want me to lock in Thursday at 2?");
      listen();
      return;
    }

    if (s === "wrap") {
      if (NO.test(t) || DONE.test(t)) {
        setConvState("ended");
        await say("Perfect — thanks so much for calling Eweb. Talk soon!");
        setStatus("");
        setPhase("done");
        return;
      }
      setConvState("need");
      await say("Of course — what else can I do for you?");
      listen();
      return;
    }
  };

  const startLive = async () => {
    cancelRef.current = false;
    setMicError("");
    reset();
    setPhase("live");
    setConvState("need");
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.getVoices();
    await Promise.all([loadPuter(), checkEleven()]);
    if (cancelRef.current) return;
    setStatus("greeting");
    await say("Hey, thanks for calling Eweb! This is Riley, your AI receptionist — what can I do for you today?");
    listen();
  };

  /* ------------------------- Sample auto-play ----------------------- */
  const playSampleFrom = useCallback((i: number) => {
    if (cancelRef.current) return;
    if (i >= sample.length) {
      setStatus("");
      setPhase("done");
      return;
    }
    const line = sample[i];
    setAiText(line.text);
    setUserText("");
    if (line.act === "reveal") setShowCal(true);
    if (line.act === "pick") {
      setShowCal(true);
      setHighlight(true);
    }
    if (line.act === "book") setBooked(true);
    say(line.text, line.from).then(() => {
      if (!cancelRef.current) setTimeout(() => playSampleFrom(i + 1), 300);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSample = () => {
    cancelRef.current = false;
    reset();
    setPhase("sample");
    setStatus("speaking");
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.getVoices();
    Promise.all([loadPuter(), checkEleven()]).then(() => {
      if (!cancelRef.current) playSampleFrom(0);
    });
  };

  const silence = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
  };

  const stop = () => {
    cancelRef.current = true;
    silence();
    recRef.current?.abort();
    setSpeaking(false);
    setStatus("");
    setPhase("idle");
    setConvState("need");
    reset();
  };

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      silence();
      recRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tap-to-reply chips (work with or without a mic)
  const chips =
    phase === "live"
      ? conv === "need"
        ? ["I'd like to book an appointment"]
        : conv === "confirm"
          ? ["Yes, book it", "Another time"]
          : conv === "wrap"
            ? ["No, that's all", "One more thing"]
            : []
      : [];

  const statusText =
    phase === "idle"
      ? "Tap to talk or hear a live call"
      : phase === "done"
        ? "Call ended"
        : status === "listening"
          ? "Listening…"
          : status === "thinking"
            ? "Thinking…"
            : "On call · live";

  return (
    <div className="relative">
      <div
        aria-hidden
        className="accent-glow pointer-events-none absolute -inset-6 -z-0 rounded-[2.5rem] opacity-40 blur-2xl"
      />
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-5 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="relative grid size-11 place-items-center rounded-full bg-brand/15 text-brand-2">
            {(phase === "live" || phase === "sample") && (
              <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
            )}
            <PhoneCall className="relative size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Eweb AI Receptionist</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {status === "listening" && <Mic className="size-3 text-brand-2" />}
              {status === "thinking" && <Loader2 className="size-3 animate-spin" />}
              {statusText}
            </p>
          </div>
          <span className="flex h-6 items-end gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-brand-2/80 transition-all duration-150"
                style={{
                  height: speaking ? `${6 + ((i * 7 + 9) % 16)}px` : "4px",
                  animation: speaking ? `wave 0.6s ease-in-out ${i * 0.08}s infinite alternate` : "none",
                }}
              />
            ))}
          </span>
        </div>

        {/* Captions */}
        <div className="min-h-[136px] space-y-2 py-4" aria-live="polite">
          <AnimatePresence mode="wait">
            {aiText ? (
              <motion.div
                key={aiText}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-brand/20 px-3.5 py-2.5 text-sm text-foreground"
              >
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider opacity-60">
                  AI receptionist
                </span>
                {aiText}
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center px-2 text-center text-sm text-muted-foreground">
                {phase === "done"
                  ? "That's how every call goes — answered, handled, booked."
                  : "Talk to the AI and it'll book you in. Turn your sound on."}
              </div>
            )}
          </AnimatePresence>

          {userText && phase === "live" && (
            <div className="mr-auto max-w-[88%] rounded-2xl rounded-bl-sm bg-white/5 px-3.5 py-2.5 text-sm text-muted-foreground">
              <span className="mb-0.5 block text-[10px] uppercase tracking-wider opacity-60">You</span>
              {userText}
            </div>
          )}
        </div>

        {/* Calendar */}
        <AnimatePresence>
          {showCal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <CalendarPanel slot={slot} highlight={highlight} booked={booked} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booked chip */}
        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-xl border border-brand/25 bg-brand/10 px-3.5 py-2.5 text-sm"
            >
              <CalendarCheck className="size-4 text-brand-2" />
              <span className="font-medium">Appointment booked</span>
              <span className="ml-auto text-xs text-muted-foreground">{slotLabel(slot).replace("day", "")}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick-reply chips */}
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => handleUser(c)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-brand/40 hover:text-brand-2"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {micError === "denied" && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Mic is off — tap the replies above, or allow the mic to talk.
          </p>
        )}

        {/* Controls */}
        <div className="mt-4 flex items-center gap-2">
          {phase === "idle" && (
            <>
              <button
                onClick={startLive}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5 hover:shadow-white/25"
              >
                <Mic className="size-4" />
                Talk to the AI
              </button>
              <button
                onClick={startSample}
                aria-label="Play a sample call"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-white/30 hover:bg-white/10"
              >
                <Play className="size-4 fill-current" />
              </button>
            </>
          )}
          {(phase === "live" || phase === "sample") && (
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
              onClick={startLive}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5 hover:shadow-white/25"
            >
              <RotateCcw className="size-4" />
              Talk again
            </button>
          )}
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <Volume2 className="size-3" />
          Lifelike voice · books into a live calendar
        </p>
      </div>
    </div>
  );
}
