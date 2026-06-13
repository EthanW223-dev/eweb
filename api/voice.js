// Real AI phone receptionist — Twilio Voice webhook backed by Claude.
//
// Twilio calls this endpoint when someone phones your number. We answer with
// TwiML: speak a line, <Gather> the caller's speech, send it to Claude, and
// speak the reply — looping until the call wraps up. Conversation state is
// carried statelessly in the `h` query param (base64 transcript), so no
// database is required.
//
// Setup: see api/README.md. Requires env var ANTHROPIC_API_KEY on Vercel.

const MODEL = "claude-haiku-4-5-20251001"; // fast + cheap, good for live phone
const VOICE = "Polly.Joanna-Neural"; // lifelike neural Twilio/Polly voice

const SYSTEM = `You are the friendly, professional AI phone receptionist for Eweb, a small web agency run by Ethan Wilden. Eweb builds custom websites (a flat $500 one-time fee, launched in about a week) and offers an AI phone-answering service ($100/month).

Your job on this call:
- Greet warmly and find out what the caller needs.
- Answer basic questions about Eweb's services and pricing.
- If they're interested, book a consultation: collect their name and a preferred day/time, then confirm it and tell them Ethan will follow up to confirm.
- Take a message if they'd rather.

Rules:
- This is a PHONE call. Keep every reply to ONE or TWO short, natural spoken sentences. No lists, no URLs, no markdown.
- Be conversational and human. Ask one question at a time.
- When the call is clearly finished (they say goodbye, or you've booked/taken a message and they have nothing else), say a brief friendly sign-off and append the token [[END]] at the very end.`;

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

async function claudeReply(history) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { text: "Thanks for calling Eweb! Our team will call you right back.", end: true };
  }
  // Anthropic requires the first message to be from the user.
  let messages = history.map((m) => ({ role: m.role, content: m.text }));
  while (messages.length && messages[0].role === "assistant") messages = messages.slice(1);
  if (!messages.length) messages = [{ role: "user", content: "(caller is on the line)" }];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 160, system: SYSTEM, messages }),
    });
    if (!res.ok) {
      return { text: "Sorry, I'm having a little trouble. We'll call you right back!", end: true };
    }
    const data = await res.json();
    let text = (data.content?.[0]?.text || "").trim();
    let end = false;
    if (text.includes("[[END]]")) {
      end = true;
      text = text.replace(/\[\[END\]\]/g, "").trim();
    }
    return { text: text || "Sorry, could you say that again?", end };
  } catch {
    return { text: "Sorry, I'm having a little trouble. We'll call you right back!", end: true };
  }
}

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
    say = "Hi, thanks for calling Eweb! I'm the AI receptionist. How can I help you today?";
    history = [{ role: "assistant", text: say }];
  } else {
    if (speech) history.push({ role: "user", text: speech });
    const reply = await claudeReply(history);
    say = reply.text;
    end = reply.end;
    history.push({ role: "assistant", text: say });
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
