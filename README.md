# Smart Money — The Operating System for the Private Economy 💹

**Smart Money** makes private businesses **discoverable, understandable, investable and collaborative** —
the Bloomberg Terminal for private companies, starting with Kuwait and the GCC.

> **⚠️ Canonical branch: `smart-money`.** This branch is the unified merge of all Smart Money work
> (marketing site + Deal Engine business model + light theme + the authenticated app + investor terminal
> + full Arabic mirror). All future work continues from here. The older
> `claude/smart-money-platform-syjxjn` branch and the separate `smart-money` repository predate this
> merge — do not develop on them without first syncing from this branch.
> This repository's `main` is the unrelated Tropicfeel voting site — never merge into it.

## Site map

| Route | What it is |
|---|---|
| `/` and `/ar` | Marketing landing (light "Apple" theme): problem, mission, how-it-works, valuation teaser, platform pillars, AI deal manufacturing, Deal Engine business model, investor side, 4-phase roadmap |
| `/pricing` and `/ar/pricing` | Attract pricing (try-first, founding members) with plain-language explainers + FAQ |
| `/get-started` | 2-minute instant-valuation wizard (no signup, nothing stored) |
| `/companies`, `/company`, `/dashboard`, `/graph` (+ `/ar/...` mirrors) | Product demo (dark terminal theme) on the fictional 12-company dataset |
| `/investors` and `/ar/investors` | Investor Terminal: mandate-fit scored deal flow |
| `/app` (+ `/app/login`, `/app/onboarding`, `/app/valuation`, `/app/invest`, `/app/proposals`) | The real product: Supabase-backed auth, company onboarding, AI valuation with Business Score & Value Gap, investor mode |

Shared assets: `assets/style.css` (design system, dark + `body.light` themes), `assets/data.js` /
`assets/data-ar.js` (demo dataset EN/AR), `assets/common.js` (bilingual auth-aware chrome),
`assets/supabase.js` (+ vendored `supabase-js`) for the app.

## Deploy

Static site, zero build. The production Vercel project deploys via a bootstrap whose
`buildCommand` fetches this branch:

```
curl -sL https://codeload.github.com/salehkhajah-ui/tropicfeel-vote/tar.gz/refs/heads/smart-money -o /tmp/site.tgz && mkdir -p public && tar xzf /tmp/site.tgz -C public --strip-components=1 && rm -f public/vercel.json public/README.md
```

(or point any Vercel project's Production Branch at `smart-money`).

The `/app` section talks to the Supabase project configured in `assets/supabase.js`.

⚠️ All companies, figures, valuations, and synergy estimates outside `/app` are fictional demo data;
pricing shown is indicative launch pricing.
