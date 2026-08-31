// ===== Theme Dropdown (Light / Dark / Automatic) =====
const root = document.documentElement;
const themeOptions = document.querySelectorAll('.theme-opt');
const themeDropdown = document.querySelector('.theme-dropdown');
const themeIconBtn = document.querySelector('.theme-icon-btn');

const savedTheme = localStorage.getItem('theme') || 'automatic';
applyTheme(savedTheme);

// Toggle dropdown open/closed on button click
if (themeIconBtn) {
  themeIconBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('open');
  });
}

// Select theme and close dropdown
themeOptions.forEach(option => {
  option.addEventListener('click', () => {
    const theme = option.getAttribute('data-value');
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    themeDropdown.classList.remove('open');
  });
});

// Close dropdown when clicking anywhere else
document.addEventListener('click', () => {
  if (themeDropdown) themeDropdown.classList.remove('open');
});

function applyTheme(theme) {
  if (theme === 'automatic') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

// Keep theme in sync if the user changes OS preference while on 'automatic'
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('theme') || 'automatic') === 'automatic') {
    applyTheme('automatic');
  }
});

// ===== Mobile navigation =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navbar) {
  navToggle.addEventListener('click', () => {
    const open = navbar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close the menu after tapping a link
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navbar.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== Highlight the nav link for the section in view =====
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = navAnchors
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const visible = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visible.add(entry.target);
      } else {
        visible.delete(entry.target);
      }
    });

    // Several sections can straddle the detection band at once (short sections,
    // tall viewports) — always highlight the topmost one that's in view.
    const current = sections.find(section => visible.has(section));
    navAnchors.forEach(a => {
      a.classList.toggle('active', !!current && a.getAttribute('href') === '#' + current.id);
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(section => observer.observe(section));
}
