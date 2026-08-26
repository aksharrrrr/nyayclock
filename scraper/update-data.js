// NyayClock auto-update scraper
// Runs on GitHub Actions (free for public repos, unlimited minutes).
// Fetches NJDG live numbers + PIB Law/Justice RSS, commits data JSON only when changed.
// Architecture per research: server-side fetch (NJDG blocks browser CORS), content-hash
// change detection, sanity bounds, provenance metadata.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const META_FILE = path.join(DATA_DIR, 'provenance.json');

function parseIndianNum(s){ return +s.replace(/,/g,''); }

async function fetchWithRetry(url, tries = 3){
  for(let i = 0; i < tries; i++){
    try{
      const resp = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if(resp.ok) return await resp.text();
      console.log(`HTTP ${resp.status} on attempt ${i+1}`);
    }catch(e){ console.log(`Attempt ${i+1} failed: ${e.message}`); }
    if(i < tries - 1) await new Promise(r => setTimeout(r, 3000 * (i+1)));
  }
  return null;
}

function grab(html, label){
  const i = html.indexOf(label);
  if(i < 0) return null;
  const m = html.slice(i, i+400).match(/>([\d,]{6,15})</);
  return m ? parseIndianNum(m[1]) : null;
}

// Sanity bounds: reject implausible values (guards against partial renders)
function plausible(n){ return n && n > 10000000 && n < 100000000; } // total pending: 1cr–10cr band

async function scrapeNJDG(){
  const html = await fetchWithRetry('https://njdg.ecourts.gov.in/njdg_v3/?p=home/index');
  if(!html) return null;
  const civil = grab(html, 'Civil Cases');
  const criminal = grab(html, 'Criminal Cases');
  const total = grab(html, 'Total Cases');
  if(!plausible(total)){
    console.log('Sanity check failed on NJDG total — keeping previous snapshot.');
    return null;
  }
  return {
    civilPending: civil || null,
    criminalPending: criminal || null,
    totalPending: total,
    fetchedAt: new Date().toISOString(),
    source: 'njdg.ecourts.gov.in/njdg_v3 (server-rendered HTML)',
  };
}

async function fetchPIB(){
  // Law & Justice ministry press releases — scheme announcements surface here first.
  // PIB serves UTF-8 XML but with a misleading charset header; decode as UTF-8 directly.
  const xml = await fetchWithRetry('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3');
  if(!xml) return [];
  const items = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>[\s\S]*?<link>(.*?)<\/link>/g)]
    .slice(0, 8)
    .map(m => ({ title: m[1].trim(), link: m[2].trim() }));
  return items;
}

function sha256(s){
  return require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
}

(async () => {
  console.log('=== NyayClock data updater ===');
  let meta = {};
  try { meta = JSON.parse(fs.readFileSync(META_FILE, 'utf8')); } catch(e){}

  // 1. NJDG
  const njdg = await scrapeNJDG();
  let njdgChanged = false;
  if(njdg){
    const existing = path.join(DATA_DIR, 'njdglive.json');
    const prev = fs.existsSync(existing) ? fs.readFileSync(existing, 'utf8') : '';
    const next = JSON.stringify(njdg, null, 2);
    if(sha256(next) !== sha256(prev)){
      fs.writeFileSync(existing, next);
      njdgChanged = true;
      console.log('NJDG updated:', njdg.totalPending.toLocaleString('en-IN'), 'pending');
    } else {
      console.log('NJDG unchanged.');
    }
  }

  // 2. PIB announcements
  const pib = await fetchPIB();
  if(pib.length){
    const existing = path.join(DATA_DIR, 'announcements.json');
    const prev = fs.existsSync(existing) ? fs.readFileSync(existing, 'utf8') : '';
    const next = JSON.stringify({ fetchedAt: new Date().toISOString(), items: pib }, null, 2);
    if(sha256(next) !== sha256(prev)){
      fs.writeFileSync(existing, next);
      console.log('PIB announcements updated:', pib.length, 'items');
    }
  }

  // 3. Provenance record (powers the site's freshness badges)
  meta.lastRun = new Date().toISOString();
  if(njdg) meta.njdgLastGood = njdg.fetchedAt;
  meta.njdgChangedThisRun = njdgChanged;
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2));

  console.log(njdgChanged ? '✓ Data changed — commit will trigger site rebuild.' : '— No changes; exiting without commit (zero-cost run).');
})();
