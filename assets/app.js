// NyayClock shared helpers
function fmtCr(n){ return n >= 1e7 ? (n/1e7).toFixed(2) + ' crore' : n.toLocaleString('en-IN'); }
function fmtLakh(n){ return n >= 1e5 ? (n/1e5).toFixed(1) + ' lakh' : n.toLocaleString('en-IN'); }

// ---- Language state (shared) ----
let LANG = localStorage.getItem('nyay-lang') || 'en';

function setActiveNav(){ const p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === p)); }

// ---- Theme ----
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', cur);
  localStorage.setItem('nyay-theme', cur);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = cur === 'light' ? '🌙' : '☀️';
}
(function initTheme(){
  const saved = localStorage.getItem('nyay-theme');
  if(saved === 'light') document.documentElement.setAttribute('data-theme','light');
})();

// ---- Global controls injection ----
function injectGlobalControls(){
  const nav = document.querySelector('.nav');
  if(!nav || document.getElementById('globalControls')) return;
  const div = document.createElement('div');
  div.id = 'globalControls';
  div.style.cssText = 'display:flex;gap:.5rem;align-items:center';
  div.innerHTML = `
    <select id="langSel" title="Language / भाषा" style="width:auto;padding:.4rem .7rem;font-size:.78rem;background:var(--panel2);border:1px solid var(--border);color:var(--text);border-radius:8px">
      <option value="en">EN</option>
      <option value="hi">हिंदी</option>
    </select>
    <button id="themeBtn" onclick="toggleTheme()" title="Light/Dark" style="background:var(--panel2);border:1px solid var(--border);color:var(--text);padding:.4rem .8rem;border-radius:8px;cursor:pointer;font-size:.85rem">${document.documentElement.getAttribute('data-theme')==='light'?'🌙':'☀️'}</button>`;
  nav.appendChild(div);
}

// Apply saved language to any page with data-i18n attributes
function applyI18nGlobal(){
  const t = I18N[LANG] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(t[key]) el.textContent = t[key];
  });
  document.documentElement.lang = LANG === 'hi' ? 'hi' : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  injectGlobalControls();
  applyI18nGlobal();
  const sel = document.getElementById('langSel');
  if(sel){
    sel.value = LANG;
    sel.addEventListener('change', e => { localStorage.setItem('nyay-lang', e.target.value); location.reload(); });
  }
});

