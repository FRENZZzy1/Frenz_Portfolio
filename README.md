# My Portfolio

A React + Vite + Tailwind CSS portfolio.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Edit your content

Everything on the page — your name, bio, projects, experience, certificates,
achievements, links — lives in one file:

```
src/data.js
```

Edit that file and the page updates automatically.

## Adding images

Put image files in the `public/` folder (e.g. `public/images/profile.jpg`),
then reference them in `src/data.js` as `/images/profile.jpg`.

- **Profile photo**: set `profile.photo` in `data.js`. Leave it `null` to
  show your initials in a circle instead.
- **Project galleries**: each project has a `gallery` array of image paths.
  Currently filled with placeholder images from placehold.co — swap them
  for real screenshots. Clicking a project's thumbnail opens a full gallery
  viewer (arrow keys or on-screen buttons to navigate, Esc to close).
- **Certificates**: same idea — set `image` on each certificate entry.

## Site assistant (OpenRouter)

There's a floating chat button (bottom-right) that answers visitor questions
using the content in `data.js` as context, powered by an LLM via
[OpenRouter](https://openrouter.ai).

**Setup:**
1. Get an API key from https://openrouter.ai/keys
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Paste your key into `.env`:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-...
   ```
4. (Optional) change `VITE_OPENROUTER_MODEL` to any model listed at
   https://openrouter.ai/models — defaults to `openai/gpt-4o-mini`.
5. Restart `npm run dev` after editing `.env`.

**⚠️ Important security note:** this calls the OpenRouter API directly from
the browser, which means your API key ends up visible in your site's
JavaScript bundle to anyone who opens dev tools. For a personal portfolio
that's a common and low-risk tradeoff, but to limit exposure:

- Set a **spending limit** on the key in your OpenRouter dashboard.
- Consider creating a key scoped only to cheap/free models.
- If this ever needs to be bulletproof (e.g. the site gets real traffic),
  move the API call into a small serverless function (Vercel/Netlify
  functions both work well) so the key stays server-side, and have the
  frontend call your function instead of OpenRouter directly.

If `VITE_OPENROUTER_API_KEY` isn't set, the chat widget still renders but
tells visitors it isn't configured yet, rather than failing silently.

## Project structure

```
src/
  data.js                     <- edit your content here
  App.jsx                     <- assembles the page from the sections below
  components/
    Nav.jsx                   <- top navigation, with a mobile menu toggle
    Hero.jsx                  <- intro section + profile photo
    About.jsx                 <- bio + skills
    Projects.jsx               <- project cards with image gallery
    Experience.jsx             <- work history timeline
    Certificates.jsx           <- certificate grid + gallery
    Achievements.jsx           <- notable wins
    Contact.jsx                <- contact section + "copy email" button
    Lightbox.jsx                <- shared full-screen image viewer
    ChatAssistant.jsx           <- floating chat widget (OpenRouter)
```

## Deploy it

1. Push this folder to a GitHub repo (`.env` is gitignored, won't be pushed).
2. Go to https://vercel.com (or https://netlify.com), sign in with GitHub.
3. Import the repo — it auto-detects Vite and sets the right build command
   (`npm run build`) and output folder (`dist`).
4. In the project's environment variable settings, add
   `VITE_OPENROUTER_API_KEY` (and `VITE_OPENROUTER_MODEL` if you're using a
   non-default model) so the chat assistant works in production too.
5. Click deploy. You'll get a live URL in about a minute.

Every time you push to GitHub after that, it redeploys automatically.

## Build for production manually

```bash
npm run build
```

Outputs static files to `dist/`, which you can upload to any static host.
