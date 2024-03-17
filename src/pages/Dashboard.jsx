import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { example_db } from "@/components/example_db";
import Info from "@/icons/Info";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();
  const [load, setLoad] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [sortedData, setSortedData] = useState(example_db);
  const [infoModal, setInfoModal] = useState(false);
  const [moreInfo_db, setMoreInfo_db] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrder, setCurrentOrder] = useState("Por defecto");
  const itemsToShow = 50;

  //FUNCTION: Se ejecuta al cargar la pagina
  useEffect(() => {
    console.log("USUARIO:", userState);

    //* Tiempo de espera para cargar la pagina
    setTimeout(() => {
      setLoad(true);
    }, 250);
  }, [userState]);

  //FUNCTION: Valida si el usuario esta logueado
  useEffect(() => {
    const validateUser = onAuthStateChanged(auth, (user) => {
      //* SI esta logueado se asigna la key del usuario a la variable userState y no puede ver la pantalla de Login
      if (user) {
        if (router.pathname === "/") {
          router.push("/Dashboard");
        }
        //* Asigna el email del usuario a la variable userState
        setUserState(user.email);
        console.log("user.email:", user.email);
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

  useEffect(() => {
    console.log("Temp Key:", tempKey);
    const newItems = example_db.filter((item) => item.key === tempKey);
    setMoreInfo_db(newItems);
  }, [tempKey]);

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
    const sorted = [...example_db].sort((a, b) => {
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
    <main className="  min-h-[100lvh] px-6 pageSize pt-10">
      {load ? (
        <section className=" flex justify-center bg-white">
          <div className=" flex flex-col  border rounded-md w-full relative">
            <div className=" capitalize hidden">
              Ordenado por: <strong>{currentOrder}</strong>
            </div>
            {/*//* Titulos de la tabla */}
            <div className=" w-full grid  grid-cols-6 mt-0  border-b bg-[#f8f8f8] px-4 uppercase py-5 text-[12px] font-semibold tracking-wider">
              <div onClick={() => handleSort("nombre")}>Nombre</div>
              <div onClick={() => handleSort("cedula")}>Cédula</div>
              <div onClick={() => handleSort("centro_de_votacion")}>
                Centro de Votación
              </div>
              <div className=" text-center" onClick={() => handleSort("mesa")}>
                Mesa
              </div>
              <div
                className=" text-center"
                onClick={() => handleSort("estado_de_votacion")}
              >
                Voto
              </div>
              <div
                className=" text-center"
                onClick={() => handleSort("activista")}
              >
                Activista
              </div>
            </div>
            {/*//* Contenido de la tabla */}
            {currentData.map((item, index) => (
              <div
                className=" w-full grid grid-cols-6 border-b tablaContenido px-4 items-center text-[15px] "
                key={index}
              >
                <div>
                  {item.nombre} {item.apellido}
                </div>
                <div className="flex justify-between">
                  <div>{item.cedula}</div>
                  <button
                    onClick={() => {
                      setTempKey(item.key);

                      setTimeout(() => {
                        setInfoModal(true);
                      }, 10);
                    }}
                    className="text-[#0061FE] mr-5 pr-5 border-r"
                  >
                    <Info />
                  </button>
                </div>

                <div>{item.centro_de_votacion}</div>
                <div className="justify-center">{item.mesa}</div>
                <div
                  className={
                    item.estado_de_votacion
                      ? " bg-lime-500 my-2 mx-4"
                      : "bg-red-600 my-2 mx-4"
                  }
                ></div>
                <div className=" overflow-x-auto scroll1 justify-center ">
                  {item.activista}
                </div>
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
          <div className=" fixed bottom-0 right-2 text-[#9e9e9e] text-sm tracking-wide">
            ID: {userState}
          </div>
          {infoModal ? (
            <div className=" fixed w-full h-full bg-[#c7c7c716] glass z-50 top-0 flex justify-center items-center">
              <div className="w-full h-full max-h-[500px] max-w-[500px] bg-lime-400">
                {/*//* Contenido de la tabla */}
                {moreInfo_db.map((item, index) => (
                  <div
                    className=" w-full grid  grid-rows-8 border-b tablaContenido px-4 items-center text-[15px] "
                    key={index}
                  >
                    <div className="flex gap-5 relative">
                      <div>
                        {item.nombre} {item.apellido}
                      </div>
                      <div
                        onClick={() => {
                          setInfoModal(false);
                        }}
                        className="w-10 h-5 bg-amber-400 absolute right-5"
                      ></div>
                    </div>

                    <div>{item.cedula}</div>
                    <div>{item.telefono}</div>
                    <div>{item.direccion}</div>
                    <div>{item.centro_de_votacion}</div>
                    <div className="justify-center">{item.mesa}</div>
                    <div
                      className={
                        item.estado_de_votacion
                          ? " bg-lime-500 my-2 mx-4"
                          : "bg-red-600 my-2 mx-4"
                      }
                    ></div>
                    <div className=" overflow-x-auto scroll1 justify-center ">
                      {item.activista}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
};

export default Dashboard;
