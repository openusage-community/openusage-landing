const shell = document.querySelector('main');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');

function setTheme(isDark) {
  if (!shell || !themeToggle) return;

  shell.classList.toggle('theme-dark', isDark);
  shell.classList.toggle('theme-light', !isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));

  const label = themeToggle.querySelector('span:last-child');
  if (label) label.textContent = isDark ? 'Light' : 'Dark';
}

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

menuToggle?.addEventListener('click', () => {
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

themeToggle?.addEventListener('click', () => {
  setTheme(!shell?.classList.contains('theme-dark'));
});
