# NyayClock

Know how long your court case will actually take — before you file.

Built entirely on public Government of India data: NJDG (National Judicial Data Grid), data.gov.in, Department of Justice, NCRB, NALSA. Free forever, no sign-up, no personal data stored.

## Features

- **Timeline Predictor** — 26 case types × court/forum → median, P25/P75 disposal estimates. Free-text search ("tenant not vacating" → Rent Eviction). English + Hindi.
- **Court Explorer** — district court scorecards: cases per judge, clearance rate, congestion-adjusted wait estimates.
- **Forum Comparison** — same dispute, different forum: Lok Adalat vs consumer commission vs civil court timelines + dispute-matcher.
- **Case Tracker Guide** — CNR explainer, eCourts walkthrough, cryptic status decoder.
- **Free Legal Aid & Schemes** — Section 12 eligibility checker, victim compensation tables (₹2L–₹12L schemes), helplines, support schemes.
- **Know Your Rights** — speedy-trial rights, default bail, escalation ladder for stalled cases.
- **Live dashboard** — NJDG counters auto-refreshed daily via GitHub Actions scraper; freshness badges on every number.

## Auto-updates

`scraper/update-data.js` runs daily via GitHub Actions: scrapes NJDG v3 server-rendered counts + PIB Law Ministry RSS, commits only when values change (content-hash detection), with sanity bounds and retry/backoff.

## Run locally

Open `index.html` in a browser — it's fully static. Or:

```
npx serve .
```

## Deploy

Any static host works (Vercel/Netlify/GitHub Pages). The GitHub Action (`.github/workflows/update-data.yml`) keeps data fresh automatically.

## Data sources & license

NJDG · data.gov.in · DoJ · NCRB · NALSA — used under the Government Open Data License – India (GODL). Estimates are statistical medians from historical disposal patterns; not legal advice.
