// NyayClock charts — dependency-free SVG chart library
// Renders: donut, horizontal bars, grouped bars, line/area. Theme-aware.

const Charts = (() => {

  function colors(){
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      text: light ? '#141a26' : '#e6e9f0',
      muted: light ? '#5a6578' : '#8b94a8',
      grid: light ? '#d9dee8' : '#2a3348',
      series: ['#f59e0b','#60a5fa','#10b981','#ef4444','#a78bfa','#fb923c'],
    };
  }

  // DONUT: segments = [{label, value, color?}]
  function donut(el, segments, opts = {}){
    const c = colors();
    const total = segments.reduce((s,x)=>s+x.value,0);
    const size = opts.size || 200, r = size/2 - 14, cx = size/2, cy = size/2;
    let angle = -Math.PI/2, paths = '';
    segments.forEach((seg,i)=>{
      const frac = seg.value/total;
      const a2 = angle + frac*2*Math.PI;
      const large = frac > .5 ? 1 : 0;
      const x1 = cx + r*Math.cos(angle), y1 = cy + r*Math.sin(angle);
      const x2 = cx + r*Math.cos(a2), y2 = cy + r*Math.sin(a2);
      const color = seg.color || c.series[i % c.series.length];
      paths += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${color}" opacity=".88"><title>${seg.label}: ${seg.value.toLocaleString('en-IN')} (${(frac*100).toFixed(1)}%)</title></path>`;
      angle = a2;
    });
    el.innerHTML = `<svg viewBox="0 0 ${size} ${size}" style="width:100%;max-width:${size}px">${paths}
      <text x="${cx}" y="${cy-4}" text-anchor="middle" fill="${c.text}" font-size="${opts.centerSize||20}" font-weight="800">${opts.center||''}</text>
      <text x="${cx}" y="${cy+16}" text-anchor="middle" fill="${c.muted}" font-size="10">${opts.centerSub||''}</text></svg>`;
  }

  // HORIZONTAL BARS: rows = [{label, value, max?, color?, display?}]
  function hbars(el, rows, opts = {}){
    const c = colors();
    const max = opts.max || Math.max(...rows.map(r=>r.value));
    el.innerHTML = rows.map(r=>{
      const w = Math.min(100, r.value/max*100);
      const color = r.color || c.series[0];
      return `<div class="range-row" style="padding:.45rem 0">
        <span style="width:${opts.labelW||150}px;font-weight:600;color:var(--text);font-size:.82rem">${r.label}</span>
        <div class="range-track"><div class="range-fill" data-w="${w}" style="background:${color}"></div></div>
        <span style="font-weight:700;color:${color};font-size:.8rem;white-space:nowrap">${r.display || r.value.toLocaleString('en-IN')}</span></div>`;
    }).join('');
    requestAnimationFrame(()=>el.querySelectorAll('.range-fill').forEach(f=>f.style.width=f.dataset.w+'%'));
  }

  // GROUPED COLUMNS: groups = [{label, values:[{v,color}]}]
  function columns(el, groups, opts = {}){
    const c = colors();
    const max = Math.max(...groups.flatMap(g=>g.values.map(v=>v.v)));
    const W = opts.width || 640, H = opts.height || 220, pad = 34, bw = (W-pad*2)/groups.length;
    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%">`;
    for(let i=0;i<=4;i++){
      const y = pad + (H-pad*2)*i/4;
      svg += `<line x1="${pad}" x2="${W-pad}" y1="${y}" y2="${y}" stroke="${c.grid}" stroke-width="1"/>`;
      svg += `<text x="${pad-6}" y="${y+4}" text-anchor="end" fill="${c.muted}" font-size="9">${fmtShort(max*(1-i/4))}</text>`;
    }
    groups.forEach((g,gi)=>{
      const gx = pad + gi*bw;
      g.values.forEach((v,vi)=>{
        const vh = (H-pad*2) * v.v/max;
        const colW = (bw-16)/g.values.length;
        const x = gx + 8 + vi*colW;
        svg += `<rect x="${x.toFixed(1)}" y="${(H-pad-vh).toFixed(1)}" width="${(colW-3).toFixed(1)}" height="${vh.toFixed(1)}" rx="3" fill="${v.color||c.series[vi]}"><title>${g.label}: ${v.v.toLocaleString('en-IN')}</title></rect>`;
      });
      svg += `<text x="${gx+bw/2}" y="${H-10}" text-anchor="middle" fill="${c.muted}" font-size="9.5">${g.label}</text>`;
    });
    svg += '</svg>';
    el.innerHTML = svg;
  }

  // LINE/AREA: points = [{x,y}], shows trend
  function line(el, seriesArr, opts = {}){
    const c = colors();
    const W = opts.width || 640, H = opts.height || 220, pad = 36;
    const allY = seriesArr.flatMap(s=>s.points.map(p=>p.y));
    const maxY = Math.max(...allY)*1.08, minY = 0;
    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%">`;
    for(let i=0;i<=4;i++){
      const y = pad + (H-pad*2)*i/4;
      svg += `<line x1="${pad}" x2="${W-pad}" y1="${y}" y2="${y}" stroke="${c.grid}"/><text x="${pad-6}" y="${y+4}" text-anchor="end" fill="${c.muted}" font-size="9">${fmtShort(maxY*(1-i/4))}</text>`;
    }
    seriesArr.forEach((s,si)=>{
      const color = s.color || c.series[si];
      const pts = s.points.map((p,i)=>{
        const x = pad + (W-pad*2)*i/(p.total-1 || 1);
        const y = H-pad - (H-pad*2)*(p.y-minY)/(maxY-minY);
        return {x,y,...p};
      });
      if(opts.area !== false){
        svg += `<polygon points="${pad},${H-pad} ${pts.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ')} ${pts[pts.length-1].x.toFixed(1)},${H-pad}" fill="${color}" opacity=".12"/>`;
      }
      svg += `<polyline points="${pts.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
      pts.forEach(p=>{
        svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${color}"><title>${p.label||''}: ${p.y.toLocaleString('en-IN')}</title></circle>`;
      });
      // x labels: first, middle, last
      [0, Math.floor(pts.length/2), pts.length-1].forEach(i=>{
        if(pts[i]) svg += `<text x="${pts[i].x.toFixed(1)}" y="${H-10}" text-anchor="middle" fill="${c.muted}" font-size="9">${pts[i].label||''}</text>`;
      });
    });
    svg += '</svg>';
    el.innerHTML = svg;
  }

  function fmtShort(n){
    if(n >= 1e7) return (n/1e7).toFixed(1)+'Cr';
    if(n >= 1e5) return (n/1e5).toFixed(1)+'L';
    if(n >= 1e3) return (n/1e3).toFixed(0)+'K';
    return n.toFixed(0);
  }

  return { donut, hbars, columns, line };
})();
