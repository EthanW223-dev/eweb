# Eweb AI phone receptionist (`/api/voice`)

A real, live AI receptionist that answers an actual phone call. Twilio handles
the phone line; this Vercel serverless function generates the conversation using
Claude. No database needed — the transcript is carried in the request URL.

## What it does

1. Someone calls your Twilio number.
2. Twilio POSTs to `https://www.ewebbuild.com/api/voice`.
3. This function speaks a greeting, listens to the caller (speech-to-text),
   sends what they said to Claude, and speaks Claude's reply — looping until the
   call wraps up (greeting → answer questions → book a consultation / take a
   message → hang up).

## One-time setup (~10 minutes)

### 1. Add your Anthropic API key to Vercel

- Get a key at <https://console.anthropic.com> → API Keys.
- In Vercel: your project → **Settings → Environment Variables** → add
  `ANTHROPIC_API_KEY` = your key (Production). Redeploy.

### 2. Get a Twilio phone number

- Sign up at <https://twilio.com> (trial credit is enough to test).
- **Phone Numbers → Buy a number** (a local number is ~$1.15/mo). Make sure it
  has **Voice** capability.

### 3. Point the number at this endpoint

- Twilio Console → **Phone Numbers → Manage → Active numbers →** your number.
- Under **Voice Configuration → "A call comes in"**, choose **Webhook**, set the
  URL to:

  ```
  https://www.ewebbuild.com/api/voice
  ```

  Method: **HTTP POST**. Save.

### 4. Call it

Dial your Twilio number and talk to the AI. That's it.

## Costs (roughly)

- Twilio number: ~$1.15/month + ~$0.014/min voice + a small speech-recognition fee.
- Claude (Haiku): a few cents per call.

## Notes / next steps

- Voice is Amazon Polly "Joanna" via Twilio. Swap `VOICE` in `voice.js` for
  another (e.g. `Polly.Matthew`) if you prefer.
- Edit the `SYSTEM` prompt in `voice.js` to change how the receptionist behaves,
  its pricing answers, or booking flow.
- To actually write bookings to a real calendar (Google Calendar) or text a
  confirmation, we'd add another step — ask and we'll wire it up.
- **Security:** consider validating Twilio's request signature before going to
  production so only Twilio can trigger the endpoint.
