import { Link } from 'react-router-dom';

export default function Card({ item, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-icon">{item.image}</div>

      <div className="product-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <strong>{item.price} грн</strong>

        <div className="product-actions">
          <Link to={`/items/${item.id}`}>
            Детальніше
          </Link>

          <button onClick={() => onAdd(item)}>
            У кошик
          </button>
        </div>
      </div>
    </article>
  );
}
