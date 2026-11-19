export const formatPrice = (n) => `${n} грн`;

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

export function initTheme() {
  const button = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch { /* ігноруємо */ }

  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  apply(saved || preferred);

  function apply(theme) {
    root.dataset.theme = theme;
    if (button) {
      button.textContent = theme === 'dark' ? 'Світла тема' : 'Темна тема';
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  button?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch { /* ігноруємо */ }
  });
}

export function initModal() {
  const dialog = document.getElementById('item-modal');
  if (!dialog) return;

  dialog.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) {
      dialog.close();
      return;
    }
    const r = dialog.getBoundingClientRect();
    const outside =
      event.clientX < r.left || event.clientX > r.right ||
      event.clientY < r.top || event.clientY > r.bottom;
    if (outside) dialog.close();
  });
}

export function openModal(item) {
  const dialog = document.getElementById('item-modal');
  if (!dialog) return;

  dialog.dataset.itemId = item.id;
  dialog.querySelector('[data-modal-title]').textContent = item.name;
  dialog.querySelector('[data-modal-desc]').textContent = item.description;
  dialog.querySelector('[data-modal-price]').textContent = formatPrice(item.price);
  dialog.showModal();
}