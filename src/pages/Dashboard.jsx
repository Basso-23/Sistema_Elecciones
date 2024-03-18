import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { example_db } from "@/components/example_db";
import Info from "@/icons/Info";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();
  const [load, setLoad] = useState(false); //* Se encarga del delay en la carga de la pagina
  const [tempKey, setTempKey] = useState(""); //* Alamacena la key temporal del item seleccionado
  const [sortedData, setSortedData] = useState(example_db); //* Alamacena la base de datos
  const [infoModal, setInfoModal] = useState(false); //* Controla el estado del modal de informacion de los votantes
  const [infoModal_db, setInfoModal_db] = useState(); //* Alamacena la informacion motrada en el modal de informacion de los votantes
  const [currentPage, setCurrentPage] = useState(1); //* Se almacena la pagina actual en la paginacion
  const [currentOrder, setCurrentOrder] = useState("Por defecto"); //* Orden actual de la tabla
  const itemsToShow = 50; //* Cantidad de items a mostrar en la tabla

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

  //FUNCTION: Se ejecuta cada vez que la temKey cambia
  useEffect(() => {
    console.log("KEY:", tempKey);
    //* Filtra la info de la base de datos segun la key seleccionado y lo almacena en la variable infoModal_db
    const newItems = example_db.filter((item) => item.key === tempKey);
    setInfoModal_db(newItems);
  }, [tempKey]);

  //FUNCTION: Cambiar la página actual por los numeros
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //FUNCTION: Ir a la página siguiente
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  //FUNCTION: Ir a lapágina anterior
  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  //FUNCTION: Ordenar los datos según el campo seleccionado
  const handleSort = (field) => {
    const sorted = [...example_db].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    setSortedData(sorted);
    setCurrentOrder(field);
    setCurrentPage(1); //* Volver a la primera página después de ordenar
  };

  //* Inicializar filteredData con toda la base de datos, si el usuario es admin no filtrara nada (podra ver todos los datos).
  let filteredData = sortedData;

  //FUNCTION: Valida si el usuario es admin o un activista
  if (activistaID.includes(userState)) {
    //* SI el usuario es Activista: filtra los datos para que solo tenga acceso a los datos asignados a el
    filteredData = sortedData.filter((item) => item.activista === userState);
  }

  //* Calcular el índice inicial y final de los elementos en la página actual
  const indexOfLastData = currentPage * itemsToShow;
  const indexOfFirstData = indexOfLastData - itemsToShow;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  return (
    <main className="  min-h-[100lvh] px-6 pageSize pt-10">
      {load ? (
        <div className=" flex justify-center bg-white">
          {/*//SECTION: Table container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section className=" flex flex-col  border rounded-md w-full relative">
            {/*//* Titulos de la tabla */}
            <div className=" w-full grid  grid-cols-6 mt-0  border-b bg-[#f8f8f8] px-4 uppercase py-5 text-[12px] font-semibold tracking-wider">
              {/*//* Nombre + Apellido */}
              <div onClick={() => handleSort("nombre")}>Nombre</div>
              {/*//* Cédula */}
              <div onClick={() => handleSort("cedula")}>Cédula</div>
              {/*//* Centro de Votación */}
              <div
                className=" text-center"
                onClick={() => handleSort("centro_de_votacion")}
              >
                Centro de Votación
              </div>
              {/*//* Mesa */}
              <div className=" text-center" onClick={() => handleSort("mesa")}>
                Mesa
              </div>
              {/*//* Voto */}
              <div
                className=" text-center"
                onClick={() => handleSort("estado_de_votacion")}
              >
                Voto
              </div>
              {/*//* Activista */}
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
                className=" w-full grid grid-cols-6 border-b tablaContenido px-4 items-center text-[14px] "
                key={index}
              >
                {/*//* Nombre + Apellido */}
                <div>
                  {item.nombre} {item.apellido}
                </div>
                {/*//* Cédula + Info */}
                <div className="flex justify-between">
                  <div>{item.cedula}</div>
                  <div className="text-[#0061FE] mr-5 pr-5 border-r ">
                    <button
                      onClick={() => {
                        setTempKey(item.key);

                        setTimeout(() => {
                          setInfoModal(true);
                        }, 10);
                      }}
                    >
                      <Info />
                    </button>
                  </div>
                </div>
                {/*//* Centro de Votación */}
                <div className="justify-center">{item.centro_de_votacion}</div>
                {/*//* Mesa */}
                <div className="justify-center">{item.mesa}</div>
                {/*//* Voto */}
                <div className="justify-center font-medium">
                  {item.estado_de_votacion ? (
                    <div className="text-lime-500 my-2 mx-4 ">SI</div>
                  ) : (
                    <div className="text-red-600 my-2 mx-4">NO</div>
                  )}
                </div>
                {/*//* Activista */}
                <div className=" overflow-x-auto scroll1 justify-center">
                  {item.activista}
                </div>
              </div>
            ))}
            {/*//* Paginación */}
            <div className="mx-auto mt-10 flex gap-10">
              {/*//* Pagina anterior */}
              <button onClick={prevPage} disabled={currentPage === 1}>
                Anterior
              </button>
              {/*//* Nuemros de las paginas */}
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
              {/*//* Pagina siguiente */}
              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(filteredData.length / itemsToShow)
                }
              >
                Siguiente
              </button>
            </div>
          </section>
          {/*//SECTION: Info modal container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section>
            {infoModal ? (
              <div className=" fixed w-full h-full bg-[#c7c7c716] glass z-50 top-0 flex justify-center items-center">
                <div className="w-full h-full max-h-[500px] max-w-[500px] bg-lime-400">
                  {/*//* Contenido de la tabla */}
                  {infoModal_db.map((item, index) => (
                    <div
                      className=" w-full grid  grid-rows-8 border-b tablaContenido px-4 items-center text-[15px] "
                      key={index}
                    >
                      {/*//* Nombre + Apellido y close button */}
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
                      {/*//* Cedula */}
                      <div>{item.cedula}</div>
                      {/*//* Telefono */}
                      <div>{item.telefono}</div>
                      {/*//* Direccion */}
                      <div>{item.direccion}</div>
                      {/*//* Centro de votacion */}
                      <div>{item.centro_de_votacion}</div>
                      {/*//* Mesa */}
                      <div className="justify-center">{item.mesa}</div>
                      {/*//* Voto */}
                      <div
                        className={
                          item.estado_de_votacion
                            ? " bg-lime-500 my-2 mx-4"
                            : "bg-red-600 my-2 mx-4"
                        }
                      ></div>
                      {/*//* Activista */}
                      <div className=" overflow-x-auto scroll1 justify-center ">
                        {item.activista}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
          {/*//SECTION: User ID fixed // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section className=" fixed bottom-0 right-2 text-[#9e9e9e] text-sm tracking-wide">
            ID: {userState}
          </section>
        </div>
      ) : null}
    </main>
  );
};

export default Dashboard;
