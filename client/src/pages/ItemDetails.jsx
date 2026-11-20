import { useParams, Link } from "react-router-dom";

export default function ItemDetails() {
  const { id } = useParams();

  return (
    <>
      <h1>Деталі товару №{id}</h1>
      <Link to="/menu">Назад до меню</Link>
    </>
  );
}