import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString('uk-UA'),
      customer: formData.get('customer'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      items: cart,
      total: totalPrice
    };

    let savedOrders = [];

    try {
      savedOrders = JSON.parse(
        localStorage.getItem('brew-bean-orders') || '[]'
      );
    } catch {
      savedOrders = [];
    }

    localStorage.setItem(
      'brew-bean-orders',
      JSON.stringify([...savedOrders, order])
    );

    clearCart();
    setOrderPlaced(true);
  }

  if (orderPlaced) {
    return (
      <section className="cart-page">
        <h1>Дякуємо за замовлення! 🎉</h1>
        <p>Ваше замовлення збережено.</p>
        <Link to="/orders">Переглянути історію замовлень</Link>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <h1>Кошик</h1>
        <p>Ваш кошик поки порожній.</p>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h1>Ваш кошик</h1>

      {cart.map((item) => (
        <article className="cart-item" key={item.id}>
          <span>{item.image}</span>

          <div>
            <h3>{item.name}</h3>
            <p>{item.price} грн за шт.</p>

            <button onClick={() => decreaseQuantity(item.id)}>−</button>
            <strong> {item.quantity} </strong>
            <button onClick={() => increaseQuantity(item.id)}>+</button>

            <button onClick={() => removeFromCart(item.id)}>
              Видалити
            </button>
          </div>

          <strong>{item.price * item.quantity} грн</strong>
        </article>
      ))}

      <h2>Разом: {totalPrice} грн</h2>

      <form className="contact-form checkout-form" onSubmit={handleSubmit}>
        <h2>Оформлення замовлення</h2>

        <label htmlFor="customer-name">Ваше ім’я</label>
        <input
          id="customer-name"
          name="customer"
          type="text"
          placeholder="Введіть ім’я"
          required
        />

        <label htmlFor="customer-phone">Номер телефону</label>
        <input
          id="customer-phone"
          name="phone"
          type="tel"
          placeholder="+380..."
          required
        />

        <label htmlFor="customer-address">Адреса доставки</label>
        <input
          id="customer-address"
          name="address"
          type="text"
          placeholder="Вулиця, будинок, квартира"
          required
        />

        <button type="submit">Підтвердити замовлення</button>
      </form>
    </section>
  );
}