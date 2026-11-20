import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Brew & Bean</h1>
      <p>Затишна кав'ярня з кавою, чаєм і десертами.</p>
      <Link to="/menu">Переглянути меню</Link>
    </>
  );
}