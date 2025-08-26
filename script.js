// Mobile nav toggle + ARIA state
const toggleBtn = document.querySelector('.mobile-toggle');
const navMenu = document.getElementById('nav-menu');

if (toggleBtn && navMenu) {
  toggleBtn.addEventListener('click', () => {
    const open = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!open));
    navMenu.classList.toggle('show');
  });
}

// Current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Close mobile menu after selecting a link (small screens)
navMenu?.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 640) {
      navMenu.classList.remove('show');
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }
  });
});

// === Day/Night toggle with saved preference ===
document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'prefers-theme';
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  // Apply a mode and set the button icon
  const apply = (mode) => {
    document.body.classList.toggle('theme-light', mode === 'light');
    btn.textContent = mode === 'light' ? '☀️' : '🌙';
  };

  // Use saved preference; if none, respect OS preference
  const saved = localStorage.getItem(KEY);
  if (saved === 'light' || saved === 'dark') {
    apply(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    apply('light');
  } else {
    apply('dark');
  }

  // Toggle on click and remember
  btn.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    apply(next);
    localStorage.setItem(KEY, next);
  });
});


// Scroll-spy: highlights nav link for the section in view
(() => {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const map = new Map(links.map(a => [a.getAttribute('href'), a]));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const id = '#' + e.target.id;
      map.get(id)?.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
})();


// Copy email with feedback (works with/without Clipboard API)
(() => {
  const btn = document.querySelector('.copy-email');
  const statusEl = document.getElementById('copyStatus');
  if (!btn) return;

  const EMAIL = btn.dataset.email || '';

  function setFeedback(msg, copied) {
    if (statusEl) statusEl.textContent = msg;
    btn.classList.toggle('is-copied', !!copied);
    const base = 'Copy email';
    const label = btn.querySelector('.copy-label');
    if (label) label.textContent = copied ? 'Copied ✓' : base;
    btn.setAttribute('aria-label', copied ? 'Email copied to clipboard' : 'Copy email address to clipboard');
    if (copied) setTimeout(() => setFeedback('', false), 1400);
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        const ta = document.createElement('textarea');
        ta.value = EMAIL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setFeedback('Copied to clipboard', true);
    } catch {
      setFeedback('Couldn’t copy. Long-press to copy.', false);
    }
  }

  btn.addEventListener('click', copyEmail);
})();
