import { useState } from 'react';
import CardList from '../components/CardList';
import { useCart } from '../context/CartContext';

const products = [
  { id: 1, name: 'Капучино', category: 'Кава', price: 75, image: '☕', description: 'Ніжна кава з молочною пінкою.' },
  { id: 2, name: 'Лате', category: 'Кава', price: 85, image: '🥛', description: "М'який кавовий напій з молоком." },
  { id: 3, name: 'Американо', category: 'Кава', price: 60, image: '☕', description: 'Класична чорна кава.' },
  { id: 4, name: 'Зелений чай', category: 'Чай', price: 50, image: '🍵', description: 'Ароматний зелений чай.' },
  { id: 5, name: 'Круасан', category: 'Десерти', price: 65, image: '🥐', description: 'Свіжий хрусткий круасан.' },
  { id: 6, name: 'Чізкейк', category: 'Десерти', price: 95, image: '🍰', description: 'Ніжний вершковий десерт.' }
];

export default function Menu() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Усі');

  const { addToCart, totalItems } = useCart();

  const categories = ['Усі', 'Кава', 'Чай', 'Десерти'];

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Усі' || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="menu-page">
      <h1>Наше меню</h1>
      <p>Обирайте улюблену каву та десерти Brew & Bean!</p>

      <input
        className="search-input"
        type="search"
        placeholder="Знайти товар..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="category-filters">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? 'selected' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p>Знайдено товарів: {filteredProducts.length}</p>

      <CardList
        items={filteredProducts}
        onAdd={addToCart}
      />

      <p className="cart-message">
        У кошику товарів: {totalItems}
      </p>
    </section>
  );
}
