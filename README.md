# Smart Money — The Operating System for the Private Economy 💹

**Smart Money** makes private businesses **discoverable, understandable, investable and collaborative** —
the Bloomberg Terminal for private companies, starting with Kuwait and the GCC.

This is the product demonstration site: a full static web experience with a marketing narrative and an
interactive demo built on a fictional dataset of 12 Kuwaiti/GCC companies.

## Pages

| Route | File | What it shows |
|---|---|---|
| `/` | `index.html` | The vision: the problem, mission, platform pillars, AI deal manufacturing, the 4-phase regulatory-safe roadmap, and the 4-stream business model |
| `/companies` | `companies.html` | Company directory — search & filter by industry and intent signals, with verified vs self-reported financials and AI valuation ranges |
| `/company?id=…` | `company.html` | A company's economic profile: identity, financial health, AI valuation with confidence & methodology, readiness scores, published opportunity signals, idle assets, and mapped relationships |
| `/dashboard` | `dashboard.html` | The morning opportunity engine, viewed as Al-Deera Construction: AI-manufactured deals with approve/dismiss, capital allocation intelligence, benchmarks, and idle-asset listings |
| `/graph` | `graph.html` | The interactive Economic Graph — a live force-directed map of trade, competition, and AI-manufactured matches |

Shared assets live in `assets/` (`style.css` design system, `data.js` demo dataset, `common.js` nav/footer).

## Core ideas encoded in the demo

- **Economic profiles** — every company gets the infrastructure of a public one
- **Verified vs self-reported** metrics, clearly badged
- **AI valuations** — always shown as ranges with confidence, method, and a decision-support disclaimer (never a certified appraisal)
- **The Opportunity Engine** — the AI doesn't wait for deals; it *manufactures* them from idle assets and unmet needs
- **Phased regulatory posture** — intelligence → signals → verified data rooms → transactions only via licensed/regulated partners
- **Four revenue streams** — subscriptions, success fees, premium intelligence, and the financial services ecosystem

## Deploy

Static site — deploys as-is on Vercel (`cleanUrls` enabled in `vercel.json`). No build step, no environment variables required for the demo pages.

> The previous Tropicfeel Arabia voting site is preserved at `/vote` (with its admin panel at `/admin` and serverless API under `api/`).

⚠️ All companies, figures, valuations, and synergy estimates on the site are fictional demo data.
