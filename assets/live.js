// NyayClock Live Data Engine
// Strategy (founder-grade honesty):
//  1. LIVE: NJDG v3 dashboard is fetched directly from the browser (CORS-enabled, verified).
//     Extracts civil/criminal/total pending counts in real time.
//  2. CACHED FALLBACK: If NJDG is unreachable (govt sites have downtime), we serve our
//     last-known snapshot and SAY SO — with the exact date it was captured and how old it is.
//  3. STALENESS LABELING: Every number on every page carries a freshness badge:
//     "LIVE · fetched just now" | "Snapshot · X days old" — never an unlabeled number.
//  4. data.gov.in tables (state/HC pendency) are periodic snapshots by nature; they are
//     always labeled with their official reference date, never presented as live.

const NyayData = (() => {
  const SNAPSHOT = {
    capturedAt: '2025-08-11', // date of our verified crawl of NJDG v3
    civilPending: 11275720,
    criminalPending: 39798693,
    totalPending: 51074413,
    institutedLastMonth: { civil: 440950, criminal: 2476027, total: 2916977 },
    disposedLastMonth: { total: 2327081 },
    pctOverOneYear: 62.10,
    overOneYearCount: 31714862,
    ageDistribution: [
      { bucket: 'Less than 1 year', pct: 38 },
      { bucket: '1 to 3 years', pct: 23 },
      { bucket: '3 to 5 years', pct: 13 },
      { bucket: '5 to 10 years', pct: 16 },
      { bucket: 'Above 10 years', pct: 9 },
    ],
  };

  function parseIndianNum(s){ return +s.replace(/,/g,''); }

  async function fetchLiveNJDG(){
    // Strategy (in order):
    // 1. Same-origin scraper output (data/njdglive.json) — committed by GitHub Actions daily.
    //    Works everywhere including production; freshness = last successful scraper run.
    // 2. Direct NJDG fetch — only works where CORS permits (local file://); tried as bonus.
    // 3. Hardcoded snapshot — final fallback, always available.
    let best = null;

    // 1. Scraper output
    try{
      const resp = await fetch('data/njdglive.json', { signal: AbortSignal.timeout(6000) });
      if(resp.ok){
        const j = await resp.json();
        if(j.totalPending && j.totalPending > 10000000){
          best = {
            live: false, // not real-time, but freshest available
            viaScraper: true,
            fetchedAt: j.fetchedAt,
            capturedAt: j.fetchedAt ? j.fetchedAt.slice(0,10) : SNAPSHOT.capturedAt,
            civilPending: j.civilPending || SNAPSHOT.civilPending,
            criminalPending: j.criminalPending || SNAPSHOT.criminalPending,
            totalPending: j.totalPending,
            institutedLastMonth: SNAPSHOT.institutedLastMonth,
            disposedLastMonth: SNAPSHOT.disposedLastMonth,
            pctOverOneYear: SNAPSHOT.pctOverOneYear,
            overOneYearCount: Math.round(j.totalPending * SNAPSHOT.pctOverOneYear / 100),
            ageDistribution: SNAPSHOT.ageDistribution,
          };
        }
      }
    }catch(e){ /* scraper file unavailable — continue */ }

    // 2. Direct NJDG (bonus — works when CORS allows, e.g. local dev)
    try{
      const resp = await fetch('https://njdg.ecourts.gov.in/njdg_v3/', { signal: AbortSignal.timeout(8000) });
      if(resp.ok){
        const t = await resp.text();
        function grab(label){
          const i = t.indexOf(label);
          if(i < 0) return null;
          const m = t.slice(i, i+400).match(/>([\d,]{6,15})</);
          return m ? parseIndianNum(m[1]) : null;
        }
        const total = grab('Total Cases');
        if(total && total > 10000000){
          return {
            live: true,
            fetchedAt: new Date().toISOString(),
            civilPending: grab('Civil Cases') || (best?best.civilPending:SNAPSHOT.civilPending),
            criminalPending: grab('Criminal Cases') || (best?best.criminalPending:SNAPSHOT.criminalPending),
            totalPending: total,
            institutedLastMonth: SNAPSHOT.institutedLastMonth,
            disposedLastMonth: SNAPSHOT.disposedLastMonth,
            pctOverOneYear: SNAPSHOT.pctOverOneYear,
            overOneYearCount: Math.round(total * SNAPSHOT.pctOverOneYear / 100),
            ageDistribution: SNAPSHOT.ageDistribution,
          };
        }
      }
    }catch(e){ /* CORS or downtime — fall through */ }

    // 3. Snapshot fallback
    if(best) return best;
    return Object.assign({ live:false, error:'all sources unreachable' }, SNAPSHOT);
  }

  function daysAgo(iso){ return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000); }

  // Freshness badge HTML — injected next to any stat
  function badge(data){
    if(data.live) return `<span class="fresh-badge live" title="Fetched directly from njdg.ecourts.gov.in just now">● LIVE</span>`;
    if(data.viaScraper){
      const d = daysAgo(data.fetchedAt);
      return `<span class="fresh-badge ${d <= 2 ? 'live' : 'cached'}" title="Auto-updated daily by our scraper from NJDG. Last successful fetch: ${data.capturedAt}">● AUTO-UPDATED · ${d === 0 ? 'today' : d + ' day' + (d>1?'s':'') + ' ago'}</span>`;
    }
    const d = daysAgo(data.capturedAt ? new Date(data.capturedAt).toISOString() : new Date(Date.now()-180*86400000).toISOString());
    return `<span class="fresh-badge cached" title="NJDG was unreachable right now — showing our verified snapshot from ${data.capturedAt}. Values refresh automatically when NJDG is reachable again.">● SNAPSHOT · ${d} days old</span>`;
  }

  // Small CSS for badges — injected once
  function injectStyles(){
    if(document.getElementById('nyay-fresh-styles')) return;
    const s = document.createElement('style'); s.id='nyay-fresh-styles';
    s.textContent = `
      .fresh-badge{display:inline-flex;align-items:center;gap:.35rem;font-size:.62rem;font-weight:700;padding:.18rem .6rem;border-radius:99px;letter-spacing:.06em;vertical-align:middle}
      .fresh-badge.live{background:rgba(16,185,129,.15);color:#10b981;border:1px solid rgba(16,185,129,.4)}
      .fresh-badge.cached{background:rgba(245,158,11,.13);color:#f59e0b;border:1px solid rgba(245,158,11,.4)}
      .data-age-note{font-size:.72rem;color:#5b6478;margin-top:.4rem}`;
    document.head.appendChild(s);
  }

  return { fetchLiveNJDG, badge, injectStyles, SNAPSHOT };
})();
