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
    const itemsToShow = 4;

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
      setCurrentPage(1); // Volver a la primera página después de ordenar
    };

    if (adminID.includes(userState)) {
    }

    // Filtrar los datos que contienen el ID del activista en el campo activista_asignado
    const filteredData = sortedData.filter(
      (item) => item.activista_asignado === userState
    );

    // Calcular el índice inicial y final de los elementos en la página actual
    const indexOfLastData = currentPage * itemsToShow;
    const indexOfFirstData = indexOfLastData - itemsToShow;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("nombre")}>Nombre</th>
              <th onClick={() => handleSort("apellido")}>Apellido</th>
              <th onClick={() => handleSort("cedula")}>Cedula</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th onClick={() => handleSort("centro_de_votacion")}>
                Centro de Votación
              </th>
              <th onClick={() => handleSort("mesa_de_votacion")}>
                Mesa de Votación
              </th>
              <th onClick={() => handleSort("activista_asignado")}>
                Activista Asignado
              </th>
              <th onClick={() => handleSort("estado_de_votacion")}>
                Estado de Votación
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.apellido}</td>
                <td>{item.cedula}</td>
                <td>{item.direccion}</td>
                <td>{item.telefono}</td>
                <td>{item.centro_de_votacion}</td>
                <td>{item.mesa_de_votacion}</td>
                <td>{item.activista_asignado}</td>
                <td>{item.estado_de_votacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Paginación */}
        <div>
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
      <section className=" flex justify-center mt-20">
        <VoterTable data={example_db} />
      </section>
      <section className=" flex flex-col gap-5 justify-center items-center mt-20">
        <div>USUARIO: {userState}</div>
        {adminID.includes(userState) ? (
          <div className=" font-bold text-lime-500">ADMIN</div>
        ) : null}
        {activistaID.includes(userState) ? (
          <div className=" font-bold  text-sky-600">ACTIVISTA</div>
        ) : null}
      </section>
    </main>
  );
};

export default Dashboard;
