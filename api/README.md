# Eweb AI phone receptionist (`/api/voice`)

A real, live AI receptionist that answers an actual phone call. Twilio handles
the phone line; this Vercel serverless function generates the conversation using
Claude. No database needed — the transcript is carried in the request URL.

## What it does

1. Someone calls your Twilio number.
2. Twilio POSTs to `https://www.ewebbuild.com/api/voice`.
3. The AI (named **Riley** — change `AGENT_NAME` in `voice.js`) greets them,
   listens (speech-to-text), and chats via Claude — answering questions and
   booking a consultation — until the call wraps up.
4. **Real booking:** when the caller confirms a name + day/time, the function
   automatically **texts the caller a confirmation** and **texts you an alert**
   with their number and a **one-tap "Add to Google Calendar" link**.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ yes | Powers the conversation (Claude). |
| `TWILIO_ACCOUNT_SID` | for SMS | Send confirmation texts. From Twilio Console. |
| `TWILIO_AUTH_TOKEN` | for SMS | Send confirmation texts. From Twilio Console. |
| `OWNER_PHONE` | for alerts | Your mobile (e.g. `+1512...`) — gets a text on every booking. |

Without the Twilio/owner vars the call still works end-to-end; it just won't
send texts. The greeting voice is set by `VOICE` in `voice.js`.

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
- SMS confirmations: ~$0.0079 per text.
- Claude (Haiku): a few cents per call.

## Notes / next steps

- Voice is the lifelike `Polly.Joanna-Neural`. Swap `VOICE` in `voice.js` for
  another (e.g. `Polly.Matthew-Neural`) if you prefer. The AI's name (`Riley`)
  and personality live in `AGENT_NAME` / `SYSTEM` at the top of `voice.js`.
- **Bookings** text the caller + you, with a one-tap Google Calendar link. To
  instead write the event *straight* into your Google Calendar automatically,
  that's a Google service-account add-on — ask and we'll wire it up.
- **US A2P note:** to text US numbers reliably in production, Twilio requires
  one-time A2P 10DLC registration (free-ish, ~1 day). Trial accounts can text
  verified numbers right away for testing.
- **Security:** consider validating Twilio's request signature before going to
  production so only Twilio can trigger the endpoint.
