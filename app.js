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
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function stop() { clearInterval(timer); timer = null; }
  if (!reduce && slides.length > 1) {
    timer = setInterval(() => { if (!document.hidden) go(current + 1); }, 4500);
    ['pointerdown', 'touchstart', 'wheel'].forEach((ev) => track.addEventListener(ev, stop, { passive: true }));
  }
  update();
})();
