import Inicio from "./Inicio";

export default function App({ catalogo, setCatalogo }) {
  return (
    <>
      <Inicio catalogo={catalogo} setCatalogo={setCatalogo} />
    </>
  );
}
