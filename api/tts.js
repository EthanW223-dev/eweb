// Text-to-speech proxy for the on-page demo — keeps the ElevenLabs API key
// server-side. The browser calls /api/tts?who=ai&text=... and gets back MP3
// audio of a near-human ElevenLabs voice. Responses are cached at the edge so
// the fixed demo lines don't re-bill ElevenLabs on every visit/replay.
//
// Env vars (set in Vercel):
//   ELEVENLABS_API_KEY        (required to enable) — from elevenlabs.io
//   ELEVENLABS_VOICE_AI       (optional) — voice id for the receptionist
//   ELEVENLABS_VOICE_CALLER   (optional) — voice id for the caller
//   ELEVENLABS_MODEL          (optional) — defaults to eleven_flash_v2_5
//
// If ELEVENLABS_API_KEY is unset, ?ping=1 reports disabled and the browser
// falls back to free Polly (generative) voices automatically.

const VOICES = {
  ai: process.env.ELEVENLABS_VOICE_AI || "EXAVITQu4vr4xnSDxMaL", // "Sarah" — warm, natural
  caller: process.env.ELEVENLABS_VOICE_CALLER || "JBFqnCBsd6RMkjVDRZzb", // "George" — warm male
};
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5"; // fast + low cost

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const key = process.env.ELEVENLABS_API_KEY;

  // Lightweight availability check used by the client before it commits.
  if (url.searchParams.get("ping")) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ eleven: !!key });
    return;
  }

  if (!key) {
    res.status(503).json({ error: "tts_not_configured" });
    return;
  }

  const text = (url.searchParams.get("text") || "").slice(0, 600);
  const who = url.searchParams.get("who") === "caller" ? "caller" : "ai";
  if (!text) {
    res.status(400).json({ error: "no_text" });
    return;
  }

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICES[who]}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "content-type": "application/json",
          accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!upstream.ok) {
      res.status(502).json({ error: "tts_upstream", status: upstream.status });
      return;
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    // Cache the fixed demo lines hard so we stay well within the free tier.
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
    res.status(200).send(buf);
  } catch {
    res.status(502).json({ error: "tts_error" });
  }
}
