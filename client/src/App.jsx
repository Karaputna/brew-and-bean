import OrderHistory from './pages/OrderHistory';

import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Contacts from './pages/Contacts';
import ItemDetails from './pages/ItemDetails';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
