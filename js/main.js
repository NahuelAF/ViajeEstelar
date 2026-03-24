/* ══════════════════════════════════════════
   VIAJE ESPACIAL — main.js
   Paleta del sol: amarillo-blanco (sin manchas, sin cruz)
══════════════════════════════════════════ */

/* ── CONSTELACIÓN (finale) ── */
let constellationAnim = null;

function drawRandomConstellation(canvasEl) {
  if (constellationAnim) cancelAnimationFrame(constellationAnim);
  const ctx2 = canvasEl.getContext('2d');
  const W2 = canvasEl.width  = canvasEl.offsetWidth  || window.innerWidth;
  const H2 = canvasEl.height = canvasEl.offsetHeight || window.innerHeight;

  const numStars = 16 + Math.floor(Math.random() * 5);
  const pad = Math.min(W2, H2) * 0.08;
  const pts = [];
  for (let i = 0; i < numStars; i++) {
    pts.push({
      x: pad + Math.random() * (W2 - pad * 2),
      y: pad + Math.random() * (H2 - pad * 2),
      r: Math.random() * 2.5 + 1.8,
      phase: Math.random() * Math.PI * 2,
      big: Math.random() < 0.25,
    });
  }

  const lines = [];
  const connected = new Set([0]);
  while (connected.size < pts.length) {
    let bestDist = Infinity, bestA = -1, bestB = -1;
    for (const a of connected) {
      for (let b = 0; b < pts.length; b++) {
        if (connected.has(b)) continue;
        const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestDist) { bestDist = d; bestA = a; bestB = b; }
      }
    }
    if (bestB === -1) break;
    lines.push([bestA, bestB]);
    connected.add(bestB);
  }
  for (let e = 0; e < 4; e++) {
    const a = Math.floor(Math.random() * pts.length);
    const b = Math.floor(Math.random() * pts.length);
    if (a !== b) lines.push([a, b]);
  }

  let frame = 0;
  function tick() {
    ctx2.clearRect(0, 0, W2, H2);
    frame += 0.2;
    const starProgress = Math.min(1, frame / 60);
    const lineProgress = Math.max(0, Math.min(1, (frame - 20) / 140));
    const t2 = performance.now() * 0.001;
    const linesToDraw = Math.floor(lineProgress * lines.length);

    for (let i = 0; i < linesToDraw; i++) {
      const [a, b] = lines[i];
      const pa = pts[a], pb = pts[b];
      ctx2.beginPath();
      ctx2.moveTo(pa.x, pa.y);
      if (i === linesToDraw - 1 && lineProgress < 1) {
        const frac = (lineProgress * lines.length) % 1;
        ctx2.lineTo(pa.x + (pb.x - pa.x) * frac, pa.y + (pb.y - pa.y) * frac);
      } else {
        ctx2.lineTo(pb.x, pb.y);
      }
      ctx2.strokeStyle = 'rgba(200,215,255,0.32)';
      ctx2.lineWidth = 0.9;
      ctx2.stroke();
    }

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const pulse = 1 + Math.sin(t2 * 1.6 + p.phase) * 0.2;
      const r = p.r * pulse * starProgress;

      const hg = ctx2.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
      hg.addColorStop(0, `rgba(180,205,255,${0.20 * starProgress})`);
      hg.addColorStop(1, 'rgba(100,140,255,0)');
      ctx2.beginPath(); ctx2.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
      ctx2.fillStyle = hg; ctx2.fill();

      const sg = ctx2.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, 0, p.x, p.y, r);
      sg.addColorStop(0, 'rgba(255,255,255,1)');
      sg.addColorStop(0.4, 'rgba(210,225,255,0.9)');
      sg.addColorStop(1, 'rgba(130,165,255,0.55)');
      ctx2.beginPath(); ctx2.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx2.fillStyle = sg; ctx2.fill();

      if (p.big) {
        const cross = r * 4 * starProgress;
        ctx2.save();
        ctx2.globalAlpha = 0.38 * starProgress;
        for (let ang = 0; ang < 2; ang++) {
          const a2 = ang * Math.PI / 2;
          const cg = ctx2.createLinearGradient(
            p.x + Math.cos(a2) * cross, p.y + Math.sin(a2) * cross,
            p.x - Math.cos(a2) * cross, p.y - Math.sin(a2) * cross);
          cg.addColorStop(0, 'rgba(255,255,255,0)');
          cg.addColorStop(0.5, 'rgba(255,255,255,0.8)');
          cg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx2.beginPath();
          ctx2.moveTo(p.x + Math.cos(a2) * cross, p.y + Math.sin(a2) * cross);
          ctx2.lineTo(p.x - Math.cos(a2) * cross, p.y - Math.sin(a2) * cross);
          ctx2.strokeStyle = cg; ctx2.lineWidth = 1.5; ctx2.stroke();
        }
        ctx2.restore();
      }
    }
    constellationAnim = requestAnimationFrame(tick);
  }
  tick();
}

/* ══════════════════════════════════════════
   SETUP
══════════════════════════════════════════ */
const intro   = document.getElementById('intro');
const journey = document.getElementById('journey');
const finale  = document.getElementById('finale');
const canvas  = document.getElementById('c');
const ctx     = canvas.getContext('2d');
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

let W, H, CX, CY;
function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = canvas.width  = window.innerWidth  * dpr;
  H = canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  CX = window.innerWidth  / 2;
  CY = window.innerHeight / 2;
}
resize();
window.addEventListener('resize', resize);

/* ── COLORES PALABRAS ── */
const WORD_COLORS = [
  '#ffd700','#00e5ff','#b388ff','#69ff47','#ff9a3c',
  '#e040fb','#40c4ff','#f48fb1','#a5f3a5','#ffcc02',
  '#ff6b6b','#4fc3f7','#ce93d8','#80cbc4','#ffab91',
];

/* ── FRASES ── */
const PHRASES = [
  '💖 Mi universo','✨ Te quiero','🌟 Mi todo','💕 Corazón','🌙 Mi cielo',
  '💫 Para siempre','🦋 Mi persona favorita','🌸 Te adoro','💝 Mi estrella',
  '🌺 Mi destino','💗 Solo vos','✦ Mi vida','🌈 Mi amor','💞 Por siempre',
];

const DEPTH    = 900;
const DURATION = 30000;
let startTime  = 0;

/* ── OBJETOS ── */
function mkStar() {
  return {
    x: (Math.random() - .5) * W * 2,
    y: (Math.random() - .5) * H * 2,
    z: Math.random() * DEPTH,
    r: Math.random() * 1.5 + .4,
    speed: Math.random() * 1 + 0.5,
  };
}

function mkPhrase(z) {
  const spread = isMobile ? 280 : 500;
  return {
    phrase:  PHRASES[Math.floor(Math.random() * PHRASES.length)],
    x:       (Math.random() - .5) * spread,
    y:       (Math.random() - .5) * spread,
    z:       z || DEPTH,
    spd:     Math.random() * 2 + 2,
    size:    isMobile ? (Math.random() * 5 + 11) : (Math.random() * 8 + 16),
    opacity: Math.random() * 0.5 + 0.5,
    color:   WORD_COLORS[Math.floor(Math.random() * WORD_COLORS.length)],
  };
}

let stars = [], phrases = [], running = false, ended = false;

/* ── PARTÍCULAS SOLARES ── */
let solarParticles = [];

function mkSolarParticle(sunR, cx, cy) {
  const angle = Math.random() * Math.PI * 2;
  const dist  = sunR * (0.85 + Math.random() * 0.25);
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
    angle,
    orbitR:      dist,
    orbitSpeed:  (Math.random() * 0.008 + 0.003) * (Math.random() < .5 ? 1 : -1),
    vr:          (Math.random() - 0.5) * 0.4,
    life:        Math.random() * 40,
    maxLife:     Math.random() * 80 + 40,
    size:        Math.random() * 3 + 1,
    color: ['#fff7a0','#ffee66','#ffd700','#ffe680','#fffacd'][Math.floor(Math.random() * 5)],
    type: Math.random() < 0.3 ? 'flare' : 'particle',
  };
}

/* ── PROMINENCIAS ── */
function drawProminence(cx, cy, sunR, angle, len, spread, t, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const steps = 10;
  ctx.beginPath();
  ctx.moveTo(sunR, 0);
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    const r = sunR + Math.sin(p * Math.PI) * len;
    const s = Math.sin(p * Math.PI) * spread + Math.sin(p * 5 + t * 2) * spread * 0.3;
    ctx.lineTo(r, s);
  }
  ctx.lineTo(sunR, 0);
  const grad = ctx.createLinearGradient(sunR, 0, sunR + len, 0);
  grad.addColorStop(0,   `rgba(255,240,80,${alpha})`);
  grad.addColorStop(0.4, `rgba(255,220,40,${alpha * 0.6})`);
  grad.addColorStop(1,   'rgba(255,200,0,0)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

/* ── INIT ── */
function initJourney() {
  const starCount   = isMobile ? 400 : 260;
  const phraseCount = isMobile ?  18 :  22;
  stars   = Array.from({ length: starCount   }, mkStar);
  phrases = Array.from({ length: phraseCount }, () => mkPhrase());
  solarParticles = [];
  startTime = performance.now();
  ended = false;
  running = true;
  requestAnimationFrame(loop);
}

function proj(x, y, z) {
  const scale = DEPTH / Math.max(z, 1);
  return { sx: CX + x * scale, sy: CY + y * scale, scale };
}

/* ══════════════════════════════════════════
   MAIN LOOP
══════════════════════════════════════════ */
function loop(now) {
  if (!running) return;
  requestAnimationFrame(loop);

  const elapsed  = now - startTime;
  const progress = elapsed / DURATION;

  let spd;
  if (isMobile) {
    if      (progress < .75) spd = 20;
    else if (progress < .9)  spd = 20 * (1 - (progress - .75) / .15);
    else                     spd = 1;
  } else {
    if      (progress < .1)  spd = progress * 25;
    else if (progress < .75) spd = 20;
    else if (progress < .9)  spd = 20 * (1 - (progress - .75) / .15);
    else                     spd = 1;
  }

  ctx.fillStyle = 'rgba(7,0,15,0.25)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  /* ── ESTRELLAS ── */
  for (const s of stars) {
    s.z -= spd * s.speed;
    if (s.z <= 1) { Object.assign(s, mkStar()); s.z = DEPTH; }
    const { sx, sy, scale } = proj(s.x, s.y, s.z);
    const r = Math.min(s.r * scale, 2.5);
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = Math.min(scale * .7, 1);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  /* ── FRASES ── */
  for (const o of phrases) {
    o.z -= o.spd * spd * .07;
    const pull = Math.max(0, (progress - 0.65)) * 0.1;
    o.x += (0 - o.x) * pull;
    o.y += (0 - o.y) * pull;
    if (o.z <= 5) Object.assign(o, mkPhrase(DEPTH));

    const { sx, sy, scale } = proj(o.x, o.y, o.z);
    const maxScale = isMobile ? 1.8 : 2.2;
    const fs = o.size * Math.min(scale, maxScale);
    if (fs < 8) continue;

    ctx.globalAlpha = Math.min(1, scale * o.opacity);
    ctx.font = `${fs}px "Dancing Script", cursive`;
    ctx.fillStyle = o.color;
    ctx.fillText(o.phrase, sx - ctx.measureText(o.phrase).width / 2, sy);
  }
  ctx.globalAlpha = 1;

  /* ══════════════════════════════════════════
     SOL — halos, rayos, prominencias y partículas
  ══════════════════════════════════════════ */
  const cx   = CX, cy = CY;
  const size = 18 + Math.pow(progress, 3) * 220;
  const t    = performance.now() * 0.001;
  const sunVisible = Math.min(progress * 4, 1);

  /* 1. HALOS volumétricos */
  const halo3 = ctx.createRadialGradient(cx, cy, size * 0.6, cx, cy, size * 4.5);
  halo3.addColorStop(0,   `rgba(255,240,80,${0.07 * sunVisible})`);
  halo3.addColorStop(0.4, `rgba(255,220,40,${0.04 * sunVisible})`);
  halo3.addColorStop(1,   'rgba(200,160,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, size * 4.5, 0, Math.PI * 2);
  ctx.fillStyle = halo3; ctx.fill();

  const halo2 = ctx.createRadialGradient(cx, cy, size * 0.75, cx, cy, size * 2.8);
  halo2.addColorStop(0,   `rgba(255,250,150,${0.16 * sunVisible})`);
  halo2.addColorStop(0.5, `rgba(255,230,80,${0.09 * sunVisible})`);
  halo2.addColorStop(1,   'rgba(255,200,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, size * 2.8, 0, Math.PI * 2);
  ctx.fillStyle = halo2; ctx.fill();

  const halo1 = ctx.createRadialGradient(cx, cy, size * 0.92, cx, cy, size * 1.7);
  halo1.addColorStop(0,   `rgba(255,255,200,${0.30 * sunVisible})`);
  halo1.addColorStop(0.6, `rgba(255,245,120,${0.14 * sunVisible})`);
  halo1.addColorStop(1,   'rgba(255,220,60,0)');
  ctx.beginPath(); ctx.arc(cx, cy, size * 1.7, 0, Math.PI * 2);
  ctx.fillStyle = halo1; ctx.fill();

  /* 2. RAYOS */
  const numRays = 20;
  ctx.save();
  for (let i = 0; i < numRays; i++) {
    const baseAngle = (i / numRays) * Math.PI * 2;
    const wobble    = Math.sin(t * 1.1 + i * 2.7) * 0.05;
    const angle     = baseAngle + wobble;
    const isMain    = i % 4 === 0;
    const isMed     = i % 4 === 2;
    const rayLen    = size * (isMain ? 3.5 : isMed ? 2.5 : 1.8) + Math.sin(t * 2 + i) * size * 0.15;
    const rayWidth  = isMain ? size * 0.18 : isMed ? size * 0.10 : size * 0.05;

    const ax = cx + Math.cos(angle) * size;
    const ay = cy + Math.sin(angle) * size;
    const bx = cx + Math.cos(angle) * (size + rayLen);
    const by = cy + Math.sin(angle) * (size + rayLen);
    const perpX = -Math.sin(angle) * rayWidth * 0.5;
    const perpY =  Math.cos(angle) * rayWidth * 0.5;

    ctx.beginPath();
    ctx.moveTo(ax + perpX * 1.5, ay + perpY * 1.5);
    ctx.lineTo(ax - perpX * 1.5, ay - perpY * 1.5);
    ctx.lineTo(bx, by);
    ctx.closePath();

    const rayAlpha = (isMain ? 0.30 : isMed ? 0.18 : 0.09)
                   * (0.8 + Math.sin(t * 2.5 + i) * 0.2)
                   * sunVisible;
    const rg = ctx.createLinearGradient(ax, ay, bx, by);
    rg.addColorStop(0,    `rgba(255,255,210,${rayAlpha})`);
    rg.addColorStop(0.35, `rgba(255,245,140,${rayAlpha * 0.55})`);
    rg.addColorStop(0.75, `rgba(255,230,80,${rayAlpha * 0.20})`);
    rg.addColorStop(1,    'rgba(255,210,0,0)');
    ctx.fillStyle = rg;
    ctx.fill();
  }
  ctx.restore();

  /* 3. PROMINENCIAS */
  const promAngles = [0.4, 1.2, 2.1, 3.4, 4.8, 5.5];
  for (const pa of promAngles) {
    const angle   = pa + t * 0.08;
    const len     = size * (0.5 + Math.sin(t * 1.3 + pa) * 0.3);
    const spread2 = size * (0.18 + Math.sin(t * 0.9 + pa * 2) * 0.08);
    const palpha  = 0.45 * sunVisible * (0.7 + Math.sin(t * 2 + pa) * 0.3);
    drawProminence(cx, cy, size, angle, len, spread2, t, palpha);
    drawProminence(cx, cy, size, angle + 0.15, len * 0.6, spread2 * 0.7, t, palpha * 0.45);
  }

  /* 4. PARTÍCULAS ORBITALES */
  if (Math.random() < 0.35) {
    solarParticles.push(mkSolarParticle(size, cx, cy));
    if (solarParticles.length > 100) solarParticles.splice(0, 1);
  }
  for (let i = solarParticles.length - 1; i >= 0; i--) {
    const p = solarParticles[i];
    p.life++;
    p.angle  += p.orbitSpeed;
    p.orbitR += p.vr;
    if (p.life > p.maxLife) { solarParticles.splice(i, 1); continue; }

    const lifeRatio = p.life / p.maxLife;
    const px = cx + Math.cos(p.angle) * p.orbitR;
    const py = cy + Math.sin(p.angle) * p.orbitR;
    const pa = Math.sin(lifeRatio * Math.PI) * sunVisible;

    if (p.type === 'flare') {
      const tailLen = p.size * 4 * (1 - lifeRatio);
      const tailX   = px - Math.cos(p.angle) * tailLen;
      const tailY   = py - Math.sin(p.angle) * tailLen;
      const tg = ctx.createLinearGradient(tailX, tailY, px, py);
      tg.addColorStop(0, 'rgba(255,240,80,0)');
      tg.addColorStop(1, `rgba(255,255,180,${pa * 0.8})`);
      ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(px, py);
      ctx.strokeStyle = tg;
      ctx.lineWidth   = p.size * 0.8;
      ctx.stroke();
    }

    const pg = ctx.createRadialGradient(px, py, 0, px, py, p.size * (1 - lifeRatio * 0.5));
    pg.addColorStop(0,   `rgba(255,255,230,${pa})`);
    pg.addColorStop(0.5, `rgba(255,240,100,${pa * 0.6})`);
    pg.addColorStop(1,   'rgba(255,200,0,0)');
    ctx.beginPath();
    ctx.arc(px, py, p.size * (1 + lifeRatio * 0.8), 0, Math.PI * 2);
    ctx.fillStyle = pg;
    ctx.fill();
  }

  /* 5. SUPERFICIE SOLAR — comentada (bola amarilla oculta) */
  /*
  const body = ctx.createRadialGradient(
    cx - size * 0.25, cy - size * 0.28, size * 0.02,
    cx, cy, size
  );
  body.addColorStop(0,    '#ffffff');
  body.addColorStop(0.08, '#fffff0');
  body.addColorStop(0.20, '#ffff99');
  body.addColorStop(0.40, '#ffe033');
  body.addColorStop(0.62, '#ffc200');
  body.addColorStop(0.80, '#e08800');
  body.addColorStop(1,    '#7a4000');
  ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fillStyle = body; ctx.fill();

  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.clip();
  const numGranules = isMobile ? 18 : 28;
  for (let g = 0; g < numGranules; g++) {
    const ga = ((g / numGranules) * Math.PI * 2) + (t * 0.03 * (g % 3 === 0 ? 1 : -1));
    const gr = size * (0.2 + ((g * 7 + 3) % 11) * 0.06);
    const gx = cx + Math.cos(ga) * gr * (0.95 + Math.sin(t * 0.5 + g) * 0.05);
    const gy = cy + Math.sin(ga) * gr * (0.95 + Math.cos(t * 0.7 + g) * 0.05);
    const gs = size * (0.08 + ((g * 5) % 7) * 0.025);
    const brightness = g % 3 === 0 ? 0.20 : g % 3 === 1 ? 0.11 : 0.05;
    const gran = ctx.createRadialGradient(gx, gy, 0, gx, gy, gs);
    gran.addColorStop(0,   `rgba(255,255,200,${brightness})`);
    gran.addColorStop(0.5, `rgba(255,240,120,${brightness * 0.5})`);
    gran.addColorStop(1,   'rgba(255,200,0,0)');
    ctx.beginPath(); ctx.arc(gx, gy, gs, 0, Math.PI * 2);
    ctx.fillStyle = gran; ctx.fill();
  }
  ctx.restore();

  const spec = ctx.createRadialGradient(
    cx - size * 0.28, cy - size * 0.30, 0,
    cx - size * 0.20, cy - size * 0.20, size * 0.42
  );
  spec.addColorStop(0,   'rgba(255,255,255,0.80)');
  spec.addColorStop(0.4, 'rgba(255,255,240,0.18)');
  spec.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.beginPath();
  ctx.arc(cx - size * 0.2, cy - size * 0.2, size * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = spec; ctx.fill();

  const limb = ctx.createRadialGradient(cx, cy, size * 0.65, cx, cy, size);
  limb.addColorStop(0,   'rgba(0,0,0,0)');
  limb.addColorStop(0.7, 'rgba(0,0,0,0.06)');
  limb.addColorStop(1,   'rgba(0,0,0,0.35)');
  ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fillStyle = limb; ctx.fill();
  */

  /* ── FIN ── */
  if (progress >= 0.97 && !ended) { ended = true; running = false; doFlash(); }
}

/* ── FLASH → FINALE ── */
function doFlash() {
  let f = 0;
  const iv = setInterval(() => {
    f++;
    ctx.fillStyle = `rgba(255,255,255,${f * .1})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    if (f > 10) { clearInterval(iv); showFinale(); }
  }, 30);
}

function showFinale() {
  finale.classList.add('on');

  const container = document.getElementById('shooting-stars');
  container.innerHTML = '';
  for (let i = 0; i < 45; i++) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    const sz = Math.random() * 3 + 1;
    star.style.left   = Math.random() * 100 + 'vw';
    star.style.top    = Math.random() * 60  + 'vh';
    star.style.width  = sz + 'px';
    star.style.height = sz + 'px';
    star.style.background = ['#fff','#ffd700','#ff6eb4'][Math.floor(Math.random() * 3)];
    star.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    star.style.animationDelay    = (Math.random() * 6) + 's';
    container.appendChild(star);
  }

  const constellCanvas = document.getElementById('constellationCanvas');
  setTimeout(() => drawRandomConstellation(constellCanvas), 400);
}

/* ── AUDIO ── */
const audio = new Audio('assets/audio/music.webm');
audio.volume = 0.3;
audio.loop   = true;


function launch() {
  intro.classList.add('out');
  audio.currentTime = 0;
  audio.muted = false;
  audio.play().catch(() => {});
  setTimeout(() => {
    intro.style.display = 'none';
    journey.classList.add('on');
    initJourney();
  }, 800);
}

function restart() {
  finale.classList.remove('on');
  running = false;
  if (constellationAnim) { cancelAnimationFrame(constellationAnim); constellationAnim = null; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setTimeout(() => {
    journey.classList.remove('on');
    intro.style.display = 'flex';
    intro.classList.remove('out');
  }, 400);
}

document.getElementById('launchBtn').addEventListener('click', launch);
document.getElementById('launchBtn').addEventListener('touchend', e => { e.preventDefault(); launch(); });