// Marca que o JS está ativo (as animações de rolagem só escondem conteúdo com JS)
document.documentElement.classList.add('js');
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Número do WhatsApp (DDI + DDD + número, só dígitos)
const WHATSAPP = '5581996868253';

// Monta os links do WhatsApp com a mensagem pronta de cada botão (atributo data-wa)
document.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(el.dataset.wa);
  el.target = '_blank';
  el.rel = 'noopener';
});

// Confirmação de idade para a linha +18
const modal = document.getElementById('adult');
const opener = document.getElementById('open-adult');
const closer = document.getElementById('adult-close');

function openAdult() {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('adult-go').focus();
}
function closeAdult() {
  modal.hidden = true;
  document.body.style.overflow = '';
  opener.focus();
}
opener.addEventListener('click', openAdult);
closer.addEventListener('click', closeAdult);
document.getElementById('adult-go').addEventListener('click', () => setTimeout(closeAdult, 300));
modal.addEventListener('click', (e) => { if (e.target === modal) closeAdult(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeAdult(); });

// Carrossel de destaques: setas, bolinhas e troca automática (pausa ao tocar)
(function () {
  const track = document.getElementById('track');
  if (!track) return;
  const slides = Array.from(track.children);
  const dots = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  let current = 0;

  slides.forEach((s, i) => {
    s.setAttribute('aria-label', (i + 1) + ' de ' + slides.length);
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Foto ' + (i + 1));
    d.addEventListener('click', () => { go(i); stop(); });
    dots.appendChild(d);
  });

  function go(i) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }
  function update() {
    const w = track.clientWidth;
    current = Math.round(track.scrollLeft / (w + 12));
    Array.from(dots.children).forEach((d, i) => d.setAttribute('aria-selected', i === current ? 'true' : 'false'));
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }
  let raf;
  track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  prev.addEventListener('click', () => { go(current - 1); stop(); });
  next.addEventListener('click', () => { go(current + 1); stop(); });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); stop(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); stop(); }
  });

  // Troca automática a cada 4,5 s; para de vez quando a pessoa interage
  let timer = null;
  function stop() { clearInterval(timer); timer = null; dots.classList.remove('playing'); }
  if (!REDUCE_MOTION && slides.length > 1) {
    timer = setInterval(() => { if (!document.hidden) go(current + 1); }, 4500);
    dots.classList.add('playing');
    ['pointerdown', 'touchstart', 'wheel'].forEach((ev) => track.addEventListener(ev, stop, { passive: true }));
  }
  update();
})();

// Blocos aparecem ao rolar a página
(function () {
  const groups = [
    document.querySelectorAll('.label'),
    document.querySelectorAll('.grid .tile'),
    document.querySelectorAll('section > .btn-sec'),
    document.querySelectorAll('.steps li'),
    document.querySelectorAll('.info, .foot > *'),
  ];
  const els = [];
  groups.forEach((list) => list.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
    els.push(el);
  }));
  if (REDUCE_MOTION || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -20px 0px', threshold: 0.01 });
  els.forEach((el) => io.observe(el));
})();

// Granulado de chocolate caindo devagar no fundo
(function () {
  const canvas = document.getElementById('sprinkles');
  if (!canvas || REDUCE_MOTION) return;
  const ctx = canvas.getContext('2d');
  const colors = ['#F5C400', '#8A5A3B', '#C98B5A', '#F6E9D7', '#5A3420'];
  let w, h, dpr, bits = [];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(46, Math.max(22, (w * h) / 22000)));
    bits = Array.from({ length: count }, () => make(Math.random() * h));
  }
  function make(y) {
    return {
      x: Math.random() * w, y: y,
      len: 7 + Math.random() * 7, thick: 2.6 + Math.random() * 1.4,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.9,
      vy: 9 + Math.random() * 16, sway: Math.random() * Math.PI * 2,
      color: colors[(Math.random() * colors.length) | 0],
      alpha: 0.14 + Math.random() * 0.22,
    };
  }
  function bar(b) {
    ctx.save();
    ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.globalAlpha = b.alpha; ctx.fillStyle = b.color;
    const r = b.thick / 2, l = b.len / 2;
    ctx.beginPath();
    ctx.moveTo(-l + r, -r); ctx.lineTo(l - r, -r); ctx.arc(l - r, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-l + r, r); ctx.arc(-l + r, 0, r, Math.PI / 2, -Math.PI / 2);
    ctx.fill();
    ctx.restore();
  }
  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    ctx.clearRect(0, 0, w, h);
    bits.forEach((b, i) => {
      b.sway += dt * 0.8;
      b.y += b.vy * dt; b.x += Math.sin(b.sway) * 6 * dt; b.rot += b.vr * dt;
      if (b.y - b.len > h) bits[i] = make(-12);
      bar(b);
    });
    requestAnimationFrame(frame);
  }
  size();
  window.addEventListener('resize', size);
  requestAnimationFrame(frame);
})();
