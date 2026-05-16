// Horabik · Auto Serwis — minimal interactive layer.

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

const nav = document.querySelector('[data-nav]');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(sentinel);
new IntersectionObserver(([entry]) => {
  if (!nav) return;
  if (entry.intersectionRatio < 1) nav.setAttribute('data-stuck', '');
  else nav.removeAttribute('data-stuck');
}, { threshold: [1] }).observe(sentinel);

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
