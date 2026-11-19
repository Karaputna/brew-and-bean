// main.js: точка входу, підключається на кожній сторінці

import { fetchMenu } from './api.js';
import { initNav, initTheme, initModal, openModal, debounce, formatPrice } from './ui.js';
import { initForm } from './form.js';
import {
  addToCart, getCount, updateBadge, renderCart, initCartActions, clearCart,
} from './cart.js';

const IMAGE_DIR = 'images/';
const IMAGE_EXT = '-400.webp';

initNav();
initTheme();
initModal();
updateBadge();

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-add]');
  if (!btn) return;
  addToCart(Number(btn.dataset.add));
  flash(btn);
});

function flash(btn) {
  const old = btn.textContent;
  btn.textContent = 'Додано ✓';
  setTimeout(() => { btn.textContent = old; }, 900);
}

async function initMenuPage() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const status = document.getElementById('status');
  const searchEl = document.getElementById('search');
  const categoryEl = document.getElementById('category');
  const sortEl = document.getElementById('sort');
  const dialog = document.getElementById('item-modal');

  const setStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle('is-error', isError);
  };

  setStatus('Завантаження меню…');

  let items;
  try {
    items = await fetchMenu();
  } catch (error) {
    console.error(error);
    setStatus('Не вдалося завантажити меню. Спробуйте оновити сторінку.', true);
    return;
  }

  function createCard(item) {
    const card = document.createElement('article');
    card.dataset.id = item.id;

    if (item.image) {
      const img = document.createElement('img');
      img.src = `${IMAGE_DIR}${item.image}${IMAGE_EXT}`;
      img.alt = item.name;
      img.loading = 'lazy';
      img.addEventListener('error', () => img.remove());
      card.append(img);
    }

    const title = document.createElement('h3');
    title.textContent = item.name;

    const desc = document.createElement('p');
    desc.textContent = item.description;

    const price = document.createElement('p');
    const data = document.createElement('data');
    data.value = item.price;
    data.textContent = formatPrice(item.price);
    price.append(data);

    const details = document.createElement('button');
    details.type = 'button';
    details.textContent = 'Деталі';

    const add = document.createElement('button');
    add.type = 'button';
    add.dataset.add = item.id;
    add.textContent = 'У кошик';

    card.append(title, desc, price, details, add);
    return card;
  }

  function render() {
    const query = searchEl.value.trim().toLowerCase();
    const category = categoryEl.value;

    let list = items.filter((item) =>
      (!category || item.category === category) &&
      item.name.toLowerCase().includes(query)
    );

    switch (sortEl.value) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name':       list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'uk')); break;
    }

    grid.replaceChildren(...list.map(createCard));
    setStatus(list.length ? `Знайдено позицій: ${list.length}` : 'Нічого не знайдено. Змініть пошук або фільтр.');
  }

  searchEl.addEventListener('input', debounce(render, 300));
  categoryEl.addEventListener('change', render);
  sortEl.addEventListener('change', render);

  grid.addEventListener('click', (event) => {
    if (event.target.closest('[data-add]')) return;
    const card = event.target.closest('article[data-id]');
    if (!card) return;
    const item = items.find((i) => i.id === Number(card.dataset.id));
    if (item) openModal(item);
  });

  dialog?.querySelector('[data-modal-add]')?.addEventListener('click', (event) => {
    addToCart(Number(dialog.dataset.itemId));
    flash(event.currentTarget);
  });

  render();
}

async function initCartPage() {
  const body = document.getElementById('cart-body');
  if (!body) return;

  let items;
  try {
    items = await fetchMenu();
  } catch (error) {
    console.error(error);
    const empty = document.getElementById('cart-empty');
    empty.textContent = 'Не вдалося завантажити дані кошика. Спробуйте оновити сторінку.';
    empty.hidden = false;
    return;
  }

  const form = document.getElementById('order-form');
  const success = document.getElementById('order-success');

  const rerender = () => renderCart(items);

  initCartActions();
  initForm(form, {
    canSubmit: () => getCount() > 0,
    onSubmit(data) {
      console.log('Замовлення:', data);
      clearCart();
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      form.querySelectorAll('small').forEach((el) => { el.textContent = ''; });
      form.refresh();
      success.hidden = false;
    },
  });

  document.addEventListener('cart:change', () => {
    rerender();
    form.refresh();
    if (getCount() > 0) success.hidden = true;
  });

  rerender();
}

initMenuPage();
initCartPage();