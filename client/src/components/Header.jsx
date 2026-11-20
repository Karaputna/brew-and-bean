import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="logo">
        Brew & Bean
      </Link>

      <nav className="navigation">
        <NavLink to="/">Головна</NavLink>
        <NavLink to="/menu">Меню</NavLink>
        <NavLink to="/cart">Кошик</NavLink>
        <NavLink to="/orders">Замовлення</NavLink>
        <NavLink to="/contacts">Контакти</NavLink>
      </nav>
    </header>
  );
}
