// Real AI phone receptionist — Twilio Voice webhook backed by Claude.
//
// Twilio calls this endpoint when someone phones your number. We answer with
// TwiML: speak a line, <Gather> the caller's speech, send it to Claude, and
// speak the reply — looping until the call wraps up. When a booking is
// confirmed we text the caller a confirmation and alert the owner (with a
// one-tap Google Calendar link). Conversation state is carried statelessly in
// the `h` query param (base64 transcript), so no database is required.
//
// Setup + env vars: see api/README.md.
//   ANTHROPIC_API_KEY                    (required) — powers the conversation
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN(optional) — to send SMS confirmations
//   OWNER_PHONE                          (optional) — your mobile, for booking alerts

const MODEL = "claude-haiku-4-5-20251001"; // fast + cheap, good for live phone
const VOICE = "Polly.Joanna-Neural"; // lifelike neural Twilio/Polly voice
const AGENT_NAME = "Riley"; // the receptionist's name — change to taste

const SYSTEM = `You are ${AGENT_NAME}, the friendly AI receptionist for Eweb — a small web studio run by Ethan Wilden that builds custom websites and sets up AI phone receptionists for small businesses.

PERSONALITY: warm, upbeat, and genuinely helpful — like a sharp, likeable front-desk person who loves what they do. Sound human: use natural contractions, a little warmth, the occasional friendly aside ("oh, nice!"). Never robotic, never salesy, never over-the-top. You respect the caller's time.

THIS IS A LIVE PHONE CALL, so:
- Keep replies to ONE short spoken sentence (two only if truly necessary).
- No lists, no URLs, no spelling things out, no markdown.
- Ask ONE question at a time and actually respond to what they said.
- Mirror the caller's energy and keep it moving.

WHAT YOU HELP WITH:
- Booking a quick consultation with Ethan — collect their name and a day/time that works for them.
- Quick questions: a custom website is a flat $500 and usually goes live in about a week; the AI phone receptionist is $100 a month.
- Taking a message if they'd rather.

BOOKING: as soon as the caller has given their NAME and agreed to a specific DAY and TIME, append this on its very own line at the end of your reply (never say it out loud): [[BOOK name=<their name>; when=<day and time in plain words>; iso=<YYYY-MM-DDTHH:MM for that exact slot using today's date below>]]

ENDING: when the call is clearly finished, give a brief, warm sign-off and append [[END]] at the very end.`;

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const encodeHistory = (h) => Buffer.from(JSON.stringify(h)).toString("base64url");
const decodeHistory = (s) => {
  try {
    return s ? JSON.parse(Buffer.from(s, "base64url").toString("utf8")) : [];
  } catch {
    return [];
  }
};

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = typeof req.body === "string" ? req.body : "";
  if (!raw) {
    raw = await new Promise((resolve) => {
      let d = "";
      req.on("data", (c) => (d += c));
      req.on("end", () => resolve(d));
      req.on("error", () => resolve(""));
    });
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

// Returns the raw model text (tokens included). Token parsing happens in the handler.
async function claudeReply(history) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return "Thanks so much for calling Eweb! Our team will give you a call right back. [[END]]";
  }
  let messages = history.map((m) => ({ role: m.role, content: m.text }));
  while (messages.length && messages[0].role === "assistant") messages = messages.slice(1);
  if (!messages.length) messages = [{ role: "user", content: "(caller is on the line)" }];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        system: `${SYSTEM}\n\nToday is ${today}.`,
        messages,
      }),
    });
    if (!res.ok) {
      return "Sorry, I'm having a little trouble on my end — we'll call you right back! [[END]]";
    }
    const data = await res.json();
    return (data.content?.[0]?.text || "").trim() || "Sorry, could you say that again?";
  } catch {
    return "Sorry, I'm having a little trouble on my end — we'll call you right back! [[END]]";
  }
}

// --- Real booking: SMS confirmations + Google Calendar link --------------

async function sendSMS(to, body, from) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || !to || !from) return;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  try {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    });
  } catch {
    /* don't let a texting hiccup break the call */
  }
}

function googleCalLink(b) {
  const text = encodeURIComponent(`Eweb consultation${b.name ? ` with ${b.name}` : ""}`);
  const details = encodeURIComponent(
    `Booked by phone via the Eweb AI receptionist.${b.when ? ` Requested: ${b.when}.` : ""}${b.phone ? ` Caller: ${b.phone}.` : ""}`,
  );
  let dates = "";
  if (b.iso && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(b.iso)) {
    const start = new Date(b.iso);
    if (!isNaN(start.getTime())) {
      const end = new Date(start.getTime() + 30 * 60000);
      const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      dates = `&dates=${fmt(start)}/${fmt(end)}`;
    }
  }
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}${dates}`;
}

function parseBooking(text) {
  const m = text.match(/\[\[BOOK([^\]]*)\]\]/i);
  if (!m) return { booking: null, clean: text };
  const raw = m[1];
  const grab = (k) => (raw.match(new RegExp(`${k}=([^;\\]]+)`, "i"))?.[1] || "").trim();
  const booking = { name: grab("name"), when: grab("when"), iso: grab("iso") };
  return { booking, clean: text.replace(m[0], "").trim() };
}

async function handleBooking(booking, callerPhone, twilioNumber) {
  booking.phone = callerPhone;
  const calLink = googleCalLink(booking);
  await Promise.all([
    sendSMS(
      callerPhone,
      `Eweb: you're booked${booking.when ? ` for ${booking.when}` : ""}! Ethan will follow up to confirm. Reply here anytime with questions. 👋`,
      twilioNumber,
    ),
    process.env.OWNER_PHONE
      ? sendSMS(
          process.env.OWNER_PHONE,
          `📞 New booking via AI: ${booking.name || "a caller"} (${callerPhone})${booking.when ? ` — ${booking.when}` : ""}. Add to calendar: ${calLink}`,
          twilioNumber,
        )
      : null,
  ]);
}

// ------------------------------------------------------------------------

export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["host"];
  const base = `${proto}://${host}`;
  const url = new URL(req.url, base);

  const body = await readBody(req);
  const speech = (body.SpeechResult || "").trim();
  let history = decodeHistory(url.searchParams.get("h"));

  let say;
  let end = false;

  if (history.length === 0 && !speech) {
    // First touch — the phone just rang.
    say = `Hey, thanks for calling Eweb! This is ${AGENT_NAME}, the AI receptionist — how can I help you out today?`;
    history = [{ role: "assistant", text: say }];
  } else {
    if (speech) history.push({ role: "user", text: speech });
    let raw = await claudeReply(history);

    // Pull out a confirmed booking, then any end-of-call token.
    const { booking, clean } = parseBooking(raw);
    raw = clean;
    if (/\[\[END\]\]/i.test(raw)) {
      end = true;
      raw = raw.replace(/\[\[END\]\]/gi, "").trim();
    }
    say = raw || "Sorry, could you say that again?";
    history.push({ role: "assistant", text: say });

    if (booking) {
      await handleBooking(booking, body.From, body.To);
    }
  }

  if (history.length > 14) history = history.slice(-14);
  const next = `${base}/api/voice?h=${encodeHistory(history)}`;

  res.setHeader("Content-Type", "text/xml");
  if (end) {
    res
      .status(200)
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="${VOICE}">${xmlEscape(say)}</Say><Hangup/></Response>`,
      );
    return;
  }
  res
    .status(200)
    .send(
      `<?xml version="1.0" encoding="UTF-8"?><Response>` +
        `<Gather input="speech" action="${xmlEscape(next)}" method="POST" speechTimeout="auto" language="en-US">` +
        `<Say voice="${VOICE}">${xmlEscape(say)}</Say>` +
        `</Gather>` +
        `<Say voice="${VOICE}">Sorry, I didn't catch that.</Say>` +
        `<Redirect method="POST">${xmlEscape(next)}</Redirect>` +
        `</Response>`,
    );
}
