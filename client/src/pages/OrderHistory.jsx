
import { useEffect, useState } from 'react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('Усі');

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('brew-bean-orders') || '[]'
      );
      setOrders(savedOrders);
    } catch {
      setOrders([]);
    }
  }, []);

  function saveOrders(updatedOrders) {
    setOrders(updatedOrders);
    localStorage.setItem(
      'brew-bean-orders',
      JSON.stringify(updatedOrders)
    );
  }

  function updateStatus(id, status) {
    saveOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  }

  function deleteOrder(id) {
    saveOrders(orders.filter((order) => order.id !== id));
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'Усі') return true;
    return (order.status || 'Нове') === filter;
  });

  return (
    <section className="cart-page">
      <h1>Історія замовлень</h1>

      <label htmlFor="order-filter">Фільтр за статусом:</label>

      <select
        id="order-filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="Усі">Усі замовлення</option>
        <option value="Нове">Нові</option>
        <option value="Готується">Готуються</option>
        <option value="Виконано">Виконані</option>
      </select>

      {filteredOrders.length === 0 ? (
        <p>Замовлень у цій категорії немає.</p>
      ) : (
        filteredOrders.map((order) => (
          <article className="cart-item" key={order.id}>
            <div>
              <h3>Замовлення №{order.id}</h3>
              <p>Дата: {order.date}</p>
              <p>Клієнт: {order.customer}</p>
              <p>Телефон: {order.phone}</p>
              <p>Адреса: {order.address}</p>

              {order.items.map((item) => (
                <p key={item.id}>
                  {item.name} × {item.quantity}
                </p>
              ))}

              <p>
                Статус: <strong>{order.status || 'Нове'}</strong>
              </p>

              <select
                value={order.status || 'Нове'}
                onChange={(event) =>
                  updateStatus(order.id, event.target.value)
                }
              >
                <option value="Нове">Нове</option>
                <option value="Готується">Готується</option>
                <option value="Виконано">Виконано</option>
              </select>
            </div>

            <div>
              <strong>{order.total} грн</strong>
              <br />
              <button onClick={() => deleteOrder(order.id)}>
                Видалити замовлення
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
