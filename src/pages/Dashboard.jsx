import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { example_db } from "@/components/example_db";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();

  //FUNCTION: Se ejecuta al cargar la pagina
  useEffect(() => {
    console.log("USUARIO:", userState);
  }, [userState]);

  //FUNCTION: Valida si el usuario esta logueado
  useEffect(() => {
    const validateUser = onAuthStateChanged(auth, (user) => {
      //* SI esta logueado se asigna la key del usuario a la variable userState y no puede ver la pantalla de Login
      if (user) {
        if (router.pathname === "/") {
          router.push("/Dashboard");
        }
        setUserState(user.uid);
        console.log("user.uid:", user.uid);
      }
      //* NO esta logueado, redirige a Login
      if (!user) {
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
    });

    return () => validateUser();
  }, []);

  const VoterTable = ({ data }) => {
    const [sortedData, setSortedData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentOrder, setCurrentOrder] = useState("Por defecto");
    const itemsToShow = 5;

    // Función para cambiar la página actual
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    // Función para ir a la página siguiente
    const nextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };

    // Función para ir a la página anterior
    const prevPage = () => {
      setCurrentPage((prevPage) => prevPage - 1);
    };

    // Función para ordenar los datos según el campo seleccionado
    const handleSort = (field) => {
      const sorted = [...data].sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      });
      setSortedData(sorted);
      setCurrentOrder(field);
      setCurrentPage(1); // Volver a la primera página después de ordenar
    };

    // Filtrar los datos según el ID del activista
    let filteredData = sortedData; // Inicializar filteredData con todos los datos

    if (activistaID.includes(userState)) {
      // Si el usuario es Activista: filtrar los datos que contienen el ID del activista en el campo activista
      filteredData = sortedData.filter((item) => item.activista === userState);
    }

    // Calcular el índice inicial y final de los elementos en la página actual
    const indexOfLastData = currentPage * itemsToShow;
    const indexOfFirstData = indexOfLastData - itemsToShow;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

    return (
      <div className=" flex flex-col">
        <div className=" capitalize">
          Ordenado por: <strong>{currentOrder}</strong>
        </div>
        <div className=" w-full grid  grid-cols-9 mt-20  border-b border-t">
          <button onClick={() => handleSort("nombre")}>Nombre</button>
          <button onClick={() => handleSort("apellido")}>Apellido</button>
          <button onClick={() => handleSort("cedula")}>Cedula</button>
          <div>Direccion</div>
          <div>Telefono</div>
          <button onClick={() => handleSort("centro_de_votacion")}>
            Centro de Votación
          </button>
          <button className=" text-center" onClick={() => handleSort("mesa")}>
            Mesa
          </button>

          <button
            className=" text-center"
            onClick={() => handleSort("estado_de_votacion")}
          >
            Estado
          </button>
          <button
            className=" text-center"
            onClick={() => handleSort("activista")}
          >
            Activista
          </button>
        </div>
        {currentData.map((item, index) => (
          <div
            className=" w-full grid  grid-cols-9 border-b border-t tablaContenido "
            key={index}
          >
            <div>{item.nombre}</div>
            <div>{item.apellido}</div>
            <div>{item.cedula}</div>
            <div>{item.direccion}</div>
            <div>{item.telefono}</div>
            <div>{item.centro_de_votacion}</div>
            <div className="justify-center">{item.mesa}</div>
            <div
              className={
                item.estado_de_votacion
                  ? " bg-lime-500 my-2 mx-4"
                  : "bg-red-600 my-2 mx-4"
              }
            ></div>
            <div className=" overflow-x-auto scroll1 ">{item.activista}</div>
          </div>
        ))}
        {/* Paginación */}
        <div className="mx-auto mt-10 flex gap-10">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          {Array.from(
            { length: Math.ceil(filteredData.length / itemsToShow) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  fontWeight: currentPage === i + 1 ? "bold" : "normal",
                }}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            onClick={nextPage}
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsToShow)
            }
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  };

  return (
    <main>
      <section className=" flex justify-center">
        <VoterTable data={example_db} />
      </section>

      <div className=" absolute bottom-0 right-2 text-[#9e9e9e] text-sm tracking-wide">
        ID: {userState}
      </div>
    </main>
  );
};

export default Dashboard;
