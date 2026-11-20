import Card from './Card';

export default function CardList({ items, onAdd }) {
  if (items.length === 0) {
    return <p>На жаль, товарів не знайдено.</p>;
  }

  return (
    <div className="product-grid">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
