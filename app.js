// Horabik · Auto Serwis — interactive layer.

// 1. Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }
}, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
revealEls.forEach((el) => io.observe(el));

// 2. Sticky nav border state
const nav = document.querySelector('[data-nav]');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(sentinel);
new IntersectionObserver(([entry]) => {
  if (!nav) return;
  if (entry.intersectionRatio < 1) nav.setAttribute('data-stuck', '');
  else nav.removeAttribute('data-stuck');
}, { threshold: [1] }).observe(sentinel);

// 3. Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 4. Animated counters — fire once when the stats strip enters viewport.
//    Uses simple eased lerp on requestAnimationFrame. ~1.2s.
const counters = document.querySelectorAll('[data-count]');
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const countObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const divisor = parseFloat(el.dataset.divisor ?? '1');
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const value = easeOut(t) * target;
      const displayed = divisor !== 1
        ? (value / divisor).toFixed(1).replace('.', ',')
        : Math.round(value).toLocaleString('pl-PL');
      el.textContent = displayed + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  }
}, { threshold: 0.35 });

counters.forEach((c) => countObserver.observe(c));

// 5. FAQ accordion — close other items when one opens (single-open behavior).
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// 6. Contact form — optimistic state
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
if (form && submitBtn) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    submitBtn.dataset.state = 'done';
    submitBtn.disabled = true;
    window.setTimeout(() => {
      submitBtn.dataset.state = '';
      submitBtn.disabled = false;
      form.reset();
    }, 2800);
  });
}

// 7. Smooth anchor nav
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = nav?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
