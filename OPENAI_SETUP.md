# OpenAI ChatGPT integration

The repository now includes a secure backend proxy and a ChatGPT-style chat page.

## Files

- `chat.html` — browser chat interface
- `api/chat.js` — server-side Vercel function that calls OpenAI
- `.env.example` — example server environment variables

## Deploy with Vercel

1. Import `killernoobidk/Mohamed-Smadi-Battle-arena` into Vercel.
2. In Vercel Project Settings → Environment Variables, add:
   - `OPENAI_API_KEY`: your secret OpenAI API key
   - `OPENAI_MODEL`: optionally, for example `gpt-4o-mini`
3. Deploy.
4. Open `/chat.html` on the deployed site.

## Security

- Never put `OPENAI_API_KEY` in `chat.html`, JavaScript, HTML, or this repository.
- If a key has already been exposed anywhere public, revoke it and create a replacement in the OpenAI dashboard.
- The backend limits stored chat history and message size, but add authentication and rate limiting before offering public or paid usage.

GitHub Pages alone cannot run `api/chat.js`. Host the project on Vercel (or add an equivalent serverless function to Netlify/Cloudflare) for the API key proxy.
