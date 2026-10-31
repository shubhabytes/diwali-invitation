/* Diwali Invitation – script.js
   1) CONFIG  2) canvas particles + fireworks  3) lanterns  4) open sequence
   5) music  6) RSVP  7) copy */
(() => {
'use strict';

/* ---------- 1. EDIT YOUR DETAILS HERE ---------- */
const CONFIG = {
  date: 'Saturday, 7th November 2026',
  time: '6:00 PM onwards',
  venue: '61B Inchara,3rd floor',
  address: '4th cross Kothnoor Dinne',
  dress: 'Traditional Indian wear',
  rsvpBy: 'Kindly RSVP by 3rd November',
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbyaBWhj19LaxsXjFtxuGt8qbvIqLeKzYxz3jP72y3gg5TqQU3iilkl-b-yRdIxEWMoZeA/exec',                         // later: paste your Google Apps Script / Firebase URL
  music: 'diwali-music.mp3'    // placeholder – add your own file
};
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lite = innerWidth < 700 || matchMedia('(pointer: coarse)').matches;
document.documentElement.classList.toggle('lite', lite);
$$('[data-k]').forEach(e => e.textContent = CONFIG[e.dataset.k]);

/* ---------- 2. Canvas: golden dust, sparkles, fireworks ---------- */
const C = $('#fx'), X = C.getContext('2d'), dpr = lite ? 1 : Math.min(devicePixelRatio || 1, 2);
let W, H, raf, fireOn = false, nextFire = 0;
const parts = [], COLORS = ['#FFC857', '#D4AF37', '#FF9F1C', '#FFF0CC'];
function resize() { W = innerWidth; H = innerHeight; C.width = W * dpr; C.height = H * dpr; X.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);
const dust = Array.from({ length: reduce ? 18 : (lite ? 20 : 55) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.8 + .4, v: Math.random() * .3 + .1, p: Math.random() * 6 }));
function burst(x, y, n, speed, alpha) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283, s = Math.random() * speed;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1, f: .012 + Math.random() * .012, s: 1.6 + Math.random() * 1.4, a: alpha, c: COLORS[(Math.random() * 4) | 0] });
  }
}
function loop(t) {
  X.clearRect(0, 0, W, H);
  for (const d of dust) {
    d.y -= d.v; d.x += Math.sin(t / 2000 + d.p) * .15;
    if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W; }
    X.globalAlpha = .35 + .35 * Math.sin(t / 700 + d.p); X.fillStyle = '#FFC857';
    X.beginPath(); X.arc(d.x, d.y, d.r, 0, 6.283); X.fill();
  }
  if (fireOn && !reduce && t > nextFire) { burst(W * (.1 + Math.random() * .8), H * (.1 + Math.random() * .4), lite ? 16 : 34, 2.3, .65); nextFire = t + 2400 + Math.random() * 2800; }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .98; p.l -= p.f;
    if (p.l <= 0) { parts.splice(i, 1); continue; }
    X.globalAlpha = p.l * p.a; X.fillStyle = p.c; X.fillRect(p.x, p.y, p.s, p.s);
  }
  X.globalAlpha = 1; raf = requestAnimationFrame(loop);
}
raf = requestAnimationFrame(loop);
document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(loop); });

/* ---------- 3. Lanterns (GSAP: rise + sway + rotate + scale) ---------- */
const layer = $('#lanterns'), lanterns = [], RISE = [26, 20, 32, 24, 29];
function makeLantern(i) {
  const el = document.createElement('div'); el.className = 'lantern'; el.innerHTML = '<i></i>';
  el.style.width = (44 + (i % 3) * 12) + 'px';
  el.addEventListener('click', () => {
    const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 22, 2, 1);
    gsap.fromTo(el.firstChild, { scale: 1.3 }, { scale: 1, duration: .6, ease: 'back.out(3)' });
  });
  layer.appendChild(el); lanterns.push(el); return el;
}
function rise(el, i, fromY) {           // endless loop: rise, wrap to bottom at a new x
  gsap.fromTo(el, { y: fromY }, { y: -220, ease: 'none', duration: Math.max(5, RISE[i % 5] * (fromY + 220) / (H + 320)),
    onComplete: () => { gsap.set(el, { x: W * (.08 + Math.random() * .84) }); rise(el, i, H + 100); } });
}
function sway(el, i) {                  // side-to-side drift, tilt and a gentle scale breathe
  gsap.fromTo(el, { xPercent: -40, rotation: -6 }, { xPercent: 40, rotation: 6, duration: 3 + i * .7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  if (!lite) gsap.fromTo(el, { scale: .92 }, { scale: 1.06, duration: 4 + i * .5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}
for (let i = 0; i < (lite ? 3 : 6); i++) {
  const el = makeLantern(i), y0 = H * (.1 + (i * .17) % .8);
  gsap.set(el, { x: W * (.06 + i * .16), y: y0 });
  if (!reduce) { rise(el, i, y0); sway(el, i); }
}
function launchFromCard() {             // lanterns emerge from the opened card
  const r = $('#card').getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .4;
  for (let i = 0; i < (lite ? 4 : 8); i++) {
    const el = lanterns[i] || makeLantern(i);
    gsap.killTweensOf(el);
    gsap.set(el, { x: cx - el.offsetWidth / 2, y: cy, xPercent: 0, rotation: 0, scale: .2, opacity: 0 });
    gsap.to(el, { opacity: 1, duration: .6, delay: i * .35 });
    gsap.to(el, { x: W * (.06 + ((i * .23 + .05) % .88)), y: -220, scale: 1, duration: 9 + i * 1.6, delay: i * .35, ease: 'power1.inOut',
      onComplete: () => { rise(el, i, H + 100); } });
    gsap.delayedCall(i * .35 + 3, () => sway(el, i));
  }
  burst(cx, cy, 60, 3, 1);
}

/* ---------- 4. Open sequence ---------- */
let opened = false;
function openInvitation() {
  if (opened) return; opened = true;
  setMusic(true);
  const tl = gsap.timeline();
  tl.to('#intro', { opacity: 0, duration: 1, onComplete: () => $('#intro').style.display = 'none' })
    .set('#stage', { visibility: 'visible' }, .3)
    .to('#diyas', { opacity: 1, duration: 1.5 }, 1.5)
    .fromTo('#card', { scale: .7, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, .4)
    .to('.cover', { rotateY: -170, duration: 1.8, ease: 'power2.inOut' }, 1.5)
    .add(() => { if (!reduce) launchFromCard(); fireOn = true; }, 1.9)
    .from('.inner > :not(.mari)', { autoAlpha: 0, y: 16, stagger: .1, duration: .8 }, 2.5)
    .set('#music', { display: 'block' }, 2.5);
  if (reduce) tl.timeScale(4);
}
$('#intro').addEventListener('click', openInvitation);

/* ---------- 5. Music (starts only after the visitor's click) ---------- */
const audio = new Audio(CONFIG.music), mBtn = $('#music'); audio.loop = true; audio.volume = .5;
let on = false;
audio.addEventListener('error', () => { mBtn.title = 'Add ' + CONFIG.music + ' to enable music'; mBtn.classList.add('off'); on = false; });
function setMusic(want) {
  if (want) audio.play().then(() => { on = true; mBtn.textContent = '🔊'; }).catch(() => { on = false; mBtn.textContent = '🔇'; });
  else { audio.pause(); on = false; mBtn.textContent = '🔇'; }
}
mBtn.hidden = false; mBtn.style.display = 'none';
mBtn.addEventListener('click', e => { e.stopPropagation(); setMusic(!on); });

/* ---------- 6. RSVP (ready to connect to Google Sheets / Firebase) ---------- */
const THANKS = { yes: 'Wonderful! We can\'t wait to celebrate with you. 🪔', maybe: 'No worries, just let us know when you can. 🪔', no: 'We\'ll miss you. Wishing you a very happy Diwali! 🪔' };
async function submitRsvp(choice, name) {
  const payload = { choice, name, at: new Date().toISOString() };
  if (!CONFIG.rsvpEndpoint) { console.info('RSVP not stored (no backend connected yet):', payload); return; }
  await fetch(CONFIG.rsvpEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
}
$$('.rsvp button').forEach(b => b.addEventListener('click', () => {
  const name = $('#guestName').value.trim();
  if (!name) { $('#guestName').focus(); $('#thanks').textContent = 'Please add your name first.'; return; }
  $('.rsvp').classList.add('done'); $$('.rsvp button').forEach(x => x.classList.toggle('sel', x === b));
  const t = $('#thanks'); t.textContent = THANKS[b.dataset.c];
  gsap.fromTo(t, { autoAlpha: 0, y: 12, scale: .9 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(2)' });
  const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 30, 2.4, 1);
  submitRsvp(b.dataset.c, name).catch(err => console.warn('RSVP failed', err));
}));
})();
