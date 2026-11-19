// cart.js: кошик (зберігається в localStorage як { id: кількість })

import { formatPrice } from './ui.js';

const KEY = 'cart';

export function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* ігноруємо */ }
  updateBadge();
  document.dispatchEvent(new CustomEvent('cart:change'));
}

export function addToCart(id) {
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
}

export function changeQty(id, delta) {
  const cart = loadCart();
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = next;
  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
}

export function clearCart() {
  saveCart({});
}

export function getCount() {
  return Object.values(loadCart()).reduce((sum, qty) => sum + qty, 0);
}

export function getTotal(items) {
  const cart = loadCart();
  return items.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);
}

export function updateBadge() {
  const count = getCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
}

function cell(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

function actionButton(label, action, id, ariaLabel) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  btn.dataset.action = action;
  btn.dataset.id = id;
  btn.setAttribute('aria-label', ariaLabel);
  return btn;
}

export function renderCart(items) {
  const body = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  const emptyEl = document.getElementById('cart-empty');
  if (!body) return;

  const cart = loadCart();
  const lines = items.filter((item) => cart[item.id]);

  body.replaceChildren();

  for (const item of lines) {
    const qty = cart[item.id];
    const row = document.createElement('tr');

    row.append(
      cell('th', item.name),
      cell('td', formatPrice(item.price)),
      cell('td', qty),
      cell('td', formatPrice(item.price * qty))
    );
    row.firstElementChild.scope = 'row';

    const actions = document.createElement('td');
    actions.append(
      actionButton('−', 'dec', item.id, `Менше: ${item.name}`),
      actionButton('+', 'inc', item.id, `Більше: ${item.name}`),
      actionButton('×', 'remove', item.id, `Видалити: ${item.name}`)
    );
    row.append(actions);
    body.append(row);
  }

  if (totalEl) totalEl.textContent = formatPrice(getTotal(items));
  if (emptyEl) emptyEl.hidden = lines.length > 0;
}

export function initCartActions(onChange) {
  const body = document.getElementById('cart-body');
  if (!body) return;

  body.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'inc') changeQty(id, 1);
    if (btn.dataset.action === 'dec') changeQty(id, -1);
    if (btn.dataset.action === 'remove') removeFromCart(id);
    onChange?.();
  });
}