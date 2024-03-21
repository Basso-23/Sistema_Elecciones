import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { example_db } from "@/components/example_db";
import Info from "@/icons/Info";
import InputForm from "@/components/InputForm";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();
  const [load, setLoad] = useState(false); //* Se encarga del delay en la carga de la pagina
  const [tempKey, setTempKey] = useState(""); //* Alamacena la key temporal del item seleccionado
  const [sortedData, setSortedData] = useState(example_db); //* Alamacena la base de datos
  const [infoModal, setInfoModal] = useState(false); //* Controla el estado del modal de informacion de los votantes
  const [infoModal_db, setInfoModal_db] = useState(); //* Alamacena la informacion motrada en el modal de informacion de los votantes
  const [currentPage, setCurrentPage] = useState(1); //* Se almacena la pagina actual en la paginacion
  const [currentOrder, setCurrentOrder] = useState("Por defecto"); //* Orden actual de la tabla
  const [searchTermCedula, setSearchTermCedula] = useState(""); //* Input de buscar por cedula
  const [searchTermActivista, setSearchTermActivista] = useState(""); //* Input de buscar por activista
  const [mobileTable, setMobileTable] = useState("cedula"); //* Controla cual es la tabla que se vera en mobile
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

  //FUNCTION: Search bar CEDULA
  const handleSearchCedula = (e) => {
    const searchTermCedula = e.target.value;
    setSearchTermCedula(searchTermCedula);
    const filtered = example_db.filter((item) =>
      item.cedula.toLowerCase().includes(searchTermCedula.toLowerCase())
    );
    setSortedData(filtered);
    setCurrentPage(1); //* Volver a la primera página después de buscar
    setSearchTermActivista("");
  };

  //FUNCTION: Search bar ACTIVISTA
  const handleSearchActivista = (e) => {
    const searchTermActivista = e.target.value;
    setSearchTermActivista(searchTermActivista);
    const filtered = example_db.filter((item) =>
      item.activista.toLowerCase().includes(searchTermActivista.toLowerCase())
    );
    setSortedData(filtered);
    setCurrentPage(1); //* Volver a la primera página después de buscar
    setSearchTermCedula("");
  };
  return (
    <main className="  min-h-[100lvh] pt-10">
      {load ? (
        <div className=" bg-white px-4 pageSize">
          {/*//SECTION: Searchs inputs // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section className=" mb-5 md:flex gap-5">
            <div className=" md:max-w-[300px] w-full">
              <InputForm
                name=""
                value={searchTermCedula}
                placeholder={"Buscar por cedula..."}
                type={"text"}
                onChange={handleSearchCedula}
              />
            </div>

            {adminID.includes(userState) ? (
              <div className=" md:max-w-[300px] w-full md:mt-0 mt-3">
                <InputForm
                  name=""
                  value={searchTermActivista}
                  placeholder={"Buscar por activista..."}
                  type={"text"}
                  onChange={handleSearchActivista}
                />
              </div>
            ) : null}
          </section>

          <div className="flex flex-col w-full ">
            {/*//SECTION: Table container DESKTOP // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
            <section className="hidden md:flex flex-col border-l border-r border-t w-full relative">
              {/*//* Titulos de la tabla */}
              <div className=" w-full grid  grid-cols-5 mt-0  border-b bg-[#f8f8f8] px-4 uppercase py-5 text-[12px] font-semibold tracking-wider">
                {/*//* Nombre + Apellido */}
                <div onClick={() => handleSort("nombre")}>Nombre</div>
                {/*//* Cédula */}
                <div onClick={() => handleSort("cedula")}>Cédula</div>
                <div className=" grid grid-cols-2">
                  {/*//* Voto */}
                  <div
                    className=" text-center"
                    onClick={() => handleSort("estado_de_votacion")}
                  >
                    Voto
                  </div>
                  {/*//* Mesa */}
                  <div
                    className=" text-center"
                    onClick={() => handleSort("mesa")}
                  >
                    Mesa
                  </div>
                </div>
                {/*//* Centro de Votación */}
                <div
                  className=" "
                  onClick={() => handleSort("centro_de_votacion")}
                >
                  Centro de Votación
                </div>

                {/*//* Activista */}
                <div onClick={() => handleSort("activista")}>Activista</div>
              </div>

              {/*//* Contenido de la tabla */}
              {currentData.map((item, index) => (
                <div
                  onClick={() => {
                    setTempKey(item.key);

                    setTimeout(() => {
                      setInfoModal(true);
                    }, 10);
                  }}
                  className=" w-full grid grid-cols-5 border-b tablaContenido px-4 items-center text-[14px] cursor-pointer hover:text-[#0061FE] transition-all"
                  key={index}
                >
                  {/*//* Nombre + Apellido */}
                  <div>
                    {item.nombre} {item.apellido}
                  </div>
                  {/*//* Cédula */}
                  <div className=" w-full">{item.cedula}</div>
                  <div className=" grid grid-cols-2">
                    {/*//* Voto */}
                    <div className="justify-center font-medium w-full">
                      {item.estado_de_votacion ? (
                        <div className="text-lime-500 ">SI</div>
                      ) : (
                        <div className="text-red-600 ">NO</div>
                      )}
                    </div>
                    {/*//* Mesa */}
                    <div className="justify-center w-full">{item.mesa}</div>
                  </div>
                  {/*//* Centro de Votación */}
                  <div className="">{item.centro_de_votacion}</div>

                  {/*//* Activista */}
                  <div className=" overflow-x-auto scroll1">
                    {item.activista}
                  </div>
                </div>
              ))}
            </section>

            <div className="md:hidden flex flex-col gap-10">
              <div onClick={() => setMobileTable("cedula")}>Cedula</div>
              <div onClick={() => setMobileTable("mesa")}>Mesa</div>
              <div onClick={() => setMobileTable("centro")}>
                Centro de votacion
              </div>
              <div onClick={() => setMobileTable("activista")}>Activista</div>
            </div>
            {/*//SECTION: Table container MOBILE // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
            <section className="md:hidden flex flex-col border-l border-r border-t w-full relative">
              {/*//* Titulos de la tabla */}
              <div className=" w-full grid items-center  grid-cols-3 mt-0  border-b bg-[#f8f8f8] px-2 uppercase py-5 text-[12px] font-semibold tracking-wider">
                {/*//* Nombre + Apellido */}
                <div onClick={() => handleSort("nombre")}>Nombre</div>
                {/*//* Cédula */}
                <div
                  className={mobileTable === "cedula" ? "flex" : "hidden"}
                  onClick={() => handleSort("cedula")}
                >
                  Cédula
                </div>

                {/*//* Mesa */}
                <div
                  className={
                    mobileTable === "mesa" ? "flex justify-center" : "hidden"
                  }
                  onClick={() => handleSort("mesa")}
                >
                  Mesa
                </div>

                {/*//* Centro de Votación */}
                <div
                  className={mobileTable === "centro" ? " texto" : "hidden"}
                  onClick={() => handleSort("centro_de_votacion")}
                >
                  Centro de Votación
                </div>

                {/*//* Activista */}
                <div
                  className={mobileTable === "activista" ? "flex" : "hidden"}
                  onClick={() => handleSort("activista")}
                >
                  Activista
                </div>
                {/*//* Voto */}
                <div
                  className=" text-center"
                  onClick={() => handleSort("estado_de_votacion")}
                >
                  Voto
                </div>
              </div>

              {/*//* Contenido de la tabla */}
              {currentData.map((item, index) => (
                <div
                  onClick={() => {
                    setTempKey(item.key);

                    setTimeout(() => {
                      setInfoModal(true);
                    }, 10);
                  }}
                  className=" w-full grid grid-cols-3 border-b tablaContenidoMobile px-2 items-center text-[14px] cursor-pointer hover:text-[#0061FE] transition-all"
                  key={index}
                >
                  {/*//* Nombre + Apellido */}
                  <div className=" w-full flex items-center">
                    {item.nombre} <br /> {item.apellido}
                  </div>
                  {/*//* Cédula */}
                  <div
                    className={
                      mobileTable === "cedula"
                        ? "w-full flex items-center"
                        : "hidden"
                    }
                  >
                    {item.cedula}
                  </div>

                  {/*//* Mesa */}
                  <div
                    className={
                      mobileTable === "mesa"
                        ? "justify-center w-full flex"
                        : "hidden"
                    }
                  >
                    {item.mesa}
                  </div>

                  {/*//* Centro de Votación */}
                  <div className={mobileTable === "centro" ? "flex" : "hidden"}>
                    {item.centro_de_votacion}
                  </div>

                  {/*//* Activista */}
                  <div
                    className={
                      mobileTable === "activista"
                        ? "overflow-x-auto scroll1 flex"
                        : "hidden"
                    }
                  >
                    {item.activista}
                  </div>
                  {/*//* Voto */}
                  <div className="justify-center font-medium w-full items-center flex">
                    {item.estado_de_votacion ? (
                      <span className="text-lime-500 ">SI</span>
                    ) : (
                      <span className="text-red-600 ">NO</span>
                    )}
                  </div>
                </div>
              ))}
            </section>
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
          </div>

          {/*//SECTION: User ID fixed // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section className=" fixed bottom-0 right-2 text-[#9e9e9e] text-sm tracking-wide">
            ID: {userState}
          </section>
        </div>
      ) : null}

      {/*//SECTION: Info modal container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      {infoModal ? (
        <div className=" fixed w-full h-full bg-[#00000079] glass z-50 top-0 flex justify-center lg:items-center lg:pt-0 pt-[8lvh] px-3">
          <div className="w-full max-w-[400px] bg-white rrr-md flex h-fit lg:-mt-10">
            {/*//* Contenido de la tabla */}
            {infoModal_db.map((item, index) => (
              <div className="relative w-full text-[15px] overflow-hidden">
                <div
                  className=" w-full flex flex-col p-8 my-auto gap-5"
                  key={index}
                >
                  {/*//* Votante + close button */}
                  <div className="flex justify-between items-center w-full">
                    <h1 className=" text-[25px] font-semibold">Votante</h1>
                    <div className="text-[#0061FE] flex">
                      <button
                        className=" my-auto"
                        onClick={() => {
                          setInfoModal(false);
                        }}
                      >
                        <Info />
                      </button>
                    </div>
                  </div>
                  {/*//* Nombre + Apellido */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Nombre
                    </div>
                    <div>
                      {item.nombre} {item.apellido}
                    </div>
                  </div>
                  {/*//* Cedula */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Cedula
                    </div>
                    <div>{item.cedula}</div>
                  </div>

                  {/*//* Telefono */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Telefono
                    </div>
                    <div>{item.telefono}</div>
                  </div>

                  {/*//* Direccion */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Direccion
                    </div>
                    <div>{item.direccion}</div>
                  </div>

                  {/*//* Centro de votacion */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Centro de votacion
                    </div>
                    <div>{item.centro_de_votacion}</div>
                  </div>

                  <div className=" grid grid-cols-2 ">
                    {/*//* Mesa */}
                    <div className=" w-full">
                      <div className=" text-[12px] text-[#9e9e9e] mb-1">
                        Mesa
                      </div>
                      <div>{item.mesa}</div>
                    </div>

                    {/*//* Voto */}
                    <div className=" w-full">
                      <div className=" text-[12px] text-[#9e9e9e] mb-1">
                        Voto
                      </div>
                      <div className="justify-center font-medium w-full">
                        {item.estado_de_votacion ? (
                          <div className="text-lime-500">SI</div>
                        ) : (
                          <div className="text-red-600 ">NO</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/*//* Activista */}
                <div className="bg-[#0061FE] font-light text-white  text-[13px] text-center py-2 rrr-br-md rrr-bl-md overflow-x-auto scroll1 justify-center w-full ">
                  {item.activista}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Dashboard;
