import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1>404</h1>
      <p>Такої сторінки не існує.</p>
      <Link to="/">На головну</Link>
    </>
  );
}