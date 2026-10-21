# KASE Lens — Vercel public demo

## Deploy

1. Add this version of the project to https://github.com/Bigfigboy/kase-lens (keep the same repo).
2. Open https://vercel.com/new and import Bigfigboy/kase-lens.
3. Project Name: kase-lens-demo; Framework Preset: Other; Root Directory: ./; Build Command: npm run build; Output Directory: dist.
4. Click Deploy. Vercel automatically updates the site after commits to the main branch.

## What the public demo really does

- Working frontend navigation, historical KASE snapshot, market search, compare panel, interactive Risk Lab, source links and language selection.
- The AI Research section clearly states Qwen3 requires Ollama on the local machine; there are **no fabricated LLM replies** and no localhost API calls in public demo mode.
- Knowledge Studio upload is for the local backend only, not available in the public demo.
- No live stock prices, no live FX. Dated Oct 19-20, 2026 market data.

## Local full AI remains available

`npm run dev` serves the original full local Node backend with Ollama, and **does not set the Vercel public demo flag**. Use the normal START_KASE_LENS.bat on Windows.

The public demo is not an official KASE product or a source of investment advice.
