# Smart Money — The Operating System for the Private Economy 💹

**Smart Money** makes private businesses **discoverable, understandable, investable and collaborative** —
the Bloomberg Terminal for private companies, starting with Kuwait and the GCC.

This is a standalone product demonstration site: a marketing narrative plus an interactive demo
built on a fictional dataset of 12 Kuwaiti/GCC companies. Pure static HTML/CSS/JS — no build step,
no dependencies, no environment variables.

> **Note:** this project is completely independent of the Tropicfeel Arabia voting site.
> It currently lives on the `claude/smart-money-platform-syjxjn` branch of the `tropicfeel-vote`
> repository only as a holding place — see "Moving to its own repository" below.

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

## Moving to its own repository

1. Create a new empty repository on GitHub (e.g. `smart-money`), **without** a README.
2. From a clone of `tropicfeel-vote`:
   ```bash
   git checkout claude/smart-money-platform-syjxjn
   git push https://github.com/<your-username>/smart-money.git claude/smart-money-platform-syjxjn:main
   ```
3. Import the new repository into Vercel — it deploys as-is (`cleanUrls` is preconfigured).

Alternatively, deploy directly from this branch: create a **new** Vercel project from this repository
and set *Settings → Git → Production Branch* to `claude/smart-money-platform-syjxjn`. Do not change
the existing voting-site project.

⚠️ All companies, figures, valuations, and synergy estimates on the site are fictional demo data.
