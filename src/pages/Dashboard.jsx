import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Info from "@/icons/Info";
import InputForm from "@/components/InputForm";
import Filter from "@/icons/Filter";
import Search from "@/icons/Search";
import Sort from "@/icons/Sort";
import { keyMaker } from "@/components/keyMaker";
import {
  firebase_delete,
  firebase_edit,
  firebase_read,
  firebase_write,
} from "@/firebase/firebase";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();
  const [load, setLoad] = useState(false); //* Se encarga del delay en la carga de la pagina
  const [tempKey, setTempKey] = useState(""); //* Alamacena la key temporal del item seleccionado
  const [sortedData, setSortedData] = useState([]); //* Alamacena la base de datos que se van a manipular
  const [infoModal, setInfoModal] = useState(false); //* Controla el estado del modal de informacion de los votantes
  const [infoModal_db, setInfoModal_db] = useState(); //* Alamacena la informacion motrada en el modal de informacion de los votantes
  const [currentPage, setCurrentPage] = useState(1); //* Se almacena la pagina actual en la paginacion
  const [currentOrder, setCurrentOrder] = useState("Por defecto"); //* Orden actual de la tabla
  const [searchTermCedula, setSearchTermCedula] = useState(""); //* Input de buscar por cedula
  const [searchTermActivista, setSearchTermActivista] = useState(""); //* Input de buscar por activista
  const [mobileTable, setMobileTable] = useState("cedula"); //* Controla cual es la tabla que se vera en mobile
  const itemsToShow = 50; //* Cantidad de items a mostrar en la tabla

  const [data, setData] = useState([]); //* Alamacena la base de datos ENTERA sin manipular
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  const [formInfo, setFormInfo] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    direccion: "",
    telefono: "",
    centro_de_votacion: "",
    mesa: "",
    activista: "",
    estado_de_votacion: false,
  });

  const [editInfo, setEditInfo] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    direccion: "",
    telefono: "",
    centro_de_votacion: "",
    mesa: "",
    activista: "",
    estado_de_votacion: false,
  });

  //FUNCTION: Lee la base de datos al cargar la pagina
  useEffect(() => {
    //* Lee y asigna los datos de la BD requiere: (nombre de la coleccion, variable donde guardar los datos y nombre del campo por el que se ordenara)
    firebase_read("votantes", setData, "index");
  }, []);

  //FUNCTION: Asigna los datos a la variable manipulable
  useEffect(() => {
    setSortedData(data);
  }, [data]);

  //FUNCTION: Maneja el onChange los input de CREAR
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //FUNCTION: Maneja el submit del form CREAR
  const handleSubmit = async (event) => {
    event.preventDefault();

    //* Generar la key
    const randomKey = keyMaker(12);

    //* Asigna la fecha y hora actual
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleString();

    //* Definir la info a enviar
    const info = {
      key: randomKey,
      index: fechaFormateada,
      nombre: formInfo.nombre,
      apellido: formInfo.apellido,
      cedula: formInfo.cedula,
      direccion: formInfo.direccion,
      telefono: formInfo.telefono,
      centro_de_votacion: formInfo.centro_de_votacion,
      mesa: formInfo.mesa,
      activista: formInfo.activista,
      estado_de_votacion: formInfo.estado_de_votacion,
    };

    //* Almacena los datos a la BD requiere: (nombre de la coleccion, info a guardar, variable donde guardar los datos y nombre del campo por el que se ordenara)
    firebase_write("votantes", info, setData, "index");

    //* Limpiar los campos después de enviar los datos
    formInfo.nombre = "";
    formInfo.apellido = "";
    formInfo.cedula = "";
    formInfo.direccion = "";
    formInfo.telefono = "";
    formInfo.centro_de_votacion = "";
    formInfo.mesa = "";
    formInfo.activista = "";
    formInfo.estado_de_votacion = "";

    setCreateModal(false);
  };

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
    const newItems = data.filter((item) => item.key === tempKey);
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
    const sorted = [...data].sort((a, b) => {
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
    const filtered = data.filter((item) =>
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
    const filtered = data.filter((item) =>
      item.activista.toLowerCase().includes(searchTermActivista.toLowerCase())
    );
    setSortedData(filtered);
    setCurrentPage(1); //* Volver a la primera página después de buscar
    setSearchTermCedula("");
  };
  return (
    <main className="pt-8">
      {load ? (
        <div className=" bg-white px-4 pageSize">
          {/*//* CREAR button */}
          <button
            onClick={() => {
              setCreateModal(true);
            }}
            className={
              adminID.includes(userState)
                ? "py-[16px] text-sm font-medium tracking-wide text-white w-full text-center transition-all bg-[#0061FE] mb-5"
                : "hidden"
            }
          >
            <div> Registrar votante</div>
          </button>
          {/*//SECTION: Searchs inputs // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section>
            {/*//* Buscar + Icono */}
            <div className="uppercase font-semibold text-[13px] mb-2 text-[#0061FE] flex items-center">
              <Search />
              <h1 className=" text-[#0061FE] ml-1">Buscar</h1>
            </div>
            {/*//* Input buscar por cédula...*/}
            <div className=" mb-5 md:flex gap-5">
              <div className=" md:max-w-[300px] w-full">
                <InputForm
                  name=""
                  value={searchTermCedula}
                  placeholder={"buscar por cédula..."}
                  type={"text"}
                  onChange={handleSearchCedula}
                />
              </div>
              {/*//* Input buscar por activista...*/}
              {adminID.includes(userState) ? (
                <div className=" md:max-w-[300px] w-full md:mt-0 mt-3">
                  <InputForm
                    name=""
                    value={searchTermActivista}
                    placeholder={"buscar por activista..."}
                    type={"text"}
                    onChange={handleSearchActivista}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <div className="flex flex-col w-full ">
            {/*//SECTION: Table container DESKTOP // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
            <section className="hidden md:flex flex-col border-l border-r border-t w-full relative">
              {/*//* Titulos de la tabla */}
              <div className=" w-full grid  grid-cols-5 mt-0  border-b bg-[#f8f8f8] px-4 uppercase py-5 text-[12px] font-semibold tracking-wider">
                {/*//* Nombre + Apellido */}
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => handleSort("nombre")}
                >
                  <div className="select-none">Nombre</div>
                  <div
                    className={
                      currentOrder === "nombre"
                        ? "mr-4 text-[#0061FE]"
                        : "mr-4 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </div>
                {/*//* Cédula */}
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => handleSort("cedula")}
                >
                  <div className="select-none">Cédula</div>
                  <div
                    className={
                      currentOrder === "cedula"
                        ? "mr-4 text-[#0061FE]"
                        : "mr-4 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </div>
                <div className=" grid grid-cols-2">
                  {/*//* Voto */}
                  <div
                    className=" flex justify-between cursor-pointer"
                    onClick={() => handleSort("estado_de_votacion")}
                  >
                    <div className="select-none">Voto</div>
                    <div
                      className={
                        currentOrder === "estado_de_votacion"
                          ? "mr-4 text-[#0061FE]"
                          : "mr-4 text-[#a5a5a5]"
                      }
                    >
                      <Sort />
                    </div>
                  </div>
                  {/*//* Mesa */}
                  <div
                    className=" flex justify-between cursor-pointer"
                    onClick={() => handleSort("mesa")}
                  >
                    <div className="select-none">Mesa</div>
                    <div
                      className={
                        currentOrder === "mesa"
                          ? "mr-4 text-[#0061FE]"
                          : "mr-4 text-[#a5a5a5]"
                      }
                    >
                      <Sort />
                    </div>
                  </div>
                </div>
                {/*//* Centro de Votación */}
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => handleSort("centro_de_votacion")}
                >
                  <div className="select-none">Centro de Votación</div>
                  <div
                    className={
                      currentOrder === "centro_de_votacion"
                        ? "mr-4 text-[#0061FE]"
                        : "mr-4 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </div>

                {/*//* Activista */}
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => handleSort("activista")}
                >
                  <div className="select-none">Activista</div>
                  <div
                    className={
                      currentOrder === "activista"
                        ? "mr-4 text-[#0061FE]"
                        : "mr-4 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
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
            {/*//SECTION: Filtros // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
            <section className="md:hidden flex flex-col gap-2 text-[13px] mb-5">
              {/*//* Filtro + Icono */}
              <div className="uppercase font-semibold  text-[#0061FE] flex">
                <Filter />
                <h1 className=" text-[#0061FE] ">Filtro</h1>
              </div>
              {/*//* Filtro: cedula */}
              <button
                className={`border py-[13px] px-4 select-none ${
                  mobileTable === "cedula"
                    ? "text-[#0061FE]  pointer-events-none"
                    : ""
                }`}
                onClick={() => {
                  setMobileTable("cedula");
                }}
              >
                Cédula
              </button>
              {/*//* Filtro: mesa */}
              <button
                className={`border py-[13px] px-4 select-none  ${
                  mobileTable === "mesa"
                    ? "text-[#0061FE] pointer-events-none"
                    : ""
                }`}
                onClick={() => {
                  setMobileTable("mesa");
                }}
              >
                Mesa
              </button>
              {/*//* Filtro: centro de votacion */}
              <button
                className={`border py-[13px] px-4 select-none ${
                  mobileTable === "centro"
                    ? "text-[#0061FE] pointer-events-none"
                    : ""
                }`}
                onClick={() => {
                  setMobileTable("centro");
                }}
              >
                Centro de votación
              </button>
              {/*//* Filtro: activista */}
              <button
                className={`border py-[13px] px-4 select-none ${
                  mobileTable === "activista"
                    ? "text-[#0061FE]  pointer-events-none"
                    : ""
                }`}
                onClick={() => {
                  setMobileTable("activista");
                }}
              >
                Activista
              </button>
            </section>
            {/*//SECTION: Table container MOBILE // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
            <section className="md:hidden flex flex-col border-l border-r border-t w-full relative select-none">
              {/*//* Titulos de la tabla */}
              <div className=" w-full grid items-center  grid-cols-3 mt-0  border-b bg-[#f8f8f8] px-2 uppercase py-5 text-[12px] font-semibold tracking-wider">
                {/*//* Nombre + Apellido */}
                <button
                  className="flex  justify-between"
                  onClick={() => handleSort("nombre")}
                >
                  <div>Nombre</div>
                  <div
                    className={
                      currentOrder === "nombre"
                        ? "mr-4 text-[#0061FE]"
                        : "mr-4 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </button>
                {/*//* Cédula */}
                <button
                  className={
                    mobileTable === "cedula"
                      ? "flex  justify-between"
                      : "hidden"
                  }
                  onClick={() => handleSort("cedula")}
                >
                  <div>Cédula</div>
                  <div
                    className={
                      currentOrder === "cedula"
                        ? "mr-2 text-[#0061FE]"
                        : "mr-2 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </button>

                {/*//* Mesa */}
                <button
                  className={
                    mobileTable === "mesa" ? "flex  justify-between" : "hidden"
                  }
                  onClick={() => handleSort("mesa")}
                >
                  <div>Mesa</div>
                  <div
                    className={
                      currentOrder === "mesa"
                        ? "mr-2 text-[#0061FE]"
                        : "mr-2 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </button>

                {/*//* Centro de Votación */}
                <button
                  className={
                    mobileTable === "centro"
                      ? "flex  justify-between "
                      : "hidden"
                  }
                  onClick={() => handleSort("centro_de_votacion")}
                >
                  <div className="texto">Centro de Votación</div>
                  <div
                    className={
                      currentOrder === "centro_de_votacion"
                        ? "mr-2 text-[#0061FE]"
                        : "mr-2 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </button>

                {/*//* Activista */}
                <button
                  className={
                    mobileTable === "activista"
                      ? "flex  justify-between "
                      : "hidden"
                  }
                  onClick={() => handleSort("activista")}
                >
                  <div>Activista</div>
                  <div
                    className={
                      currentOrder === "activista"
                        ? "mr-2 text-[#0061FE]"
                        : "mr-2 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </button>
                {/*//* Voto */}
                <button
                  className="flex  justify-between"
                  onClick={() => handleSort("estado_de_votacion")}
                >
                  <div className="ml-4">Voto</div>
                  <div
                    className={
                      currentOrder === "estado_de_votacion"
                        ? "mr-4 text-[#0061FE]"
                        : "mr-4 text-[#a5a5a5]"
                    }
                  >
                    <Sort />
                  </div>
                </button>
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
                  className=" w-full grid grid-cols-3 border-b tablaContenidoMobile px-2 items-center text-[14px] select-none cursor-pointer hover:text-[#0061FE] transition-all"
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
              {/*//* Numeros de las paginas */}
              <div className=" font-bold "> {currentPage}</div>
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

          {/*//SECTION: User ID  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
          <section className="mt-20 mb-4  text-[12px] text-center text-[#0061FE]">
            user: {userState}
          </section>
        </div>
      ) : null}

      {/*//SECTION: CREATE modal // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      {createModal ? (
        <div className=" fixed w-full h-full bg-[#00000079] glass z-50 top-0 flex justify-center lg:items-center lg:pt-0 pt-[8lvh] px-3">
          <div className="w-full max-w-[400px] bg-white rrr-md flex h-fit lg:-mt-10">
            {/*//* Contenido de la tabla */}
            <div className="relative w-full text-[15px] overflow-hidden">
              <form
                onSubmit={handleSubmit}
                className=" w-full flex flex-col p-8 my-auto gap-3"
              >
                {/*//* Votante + close button */}
                <div className="flex justify-between items-center w-full mb-2">
                  <h1 className=" text-[25px] font-semibold">
                    Registrar votante
                  </h1>
                  <div className="text-[#0061FE] flex">
                    <button
                      className=" my-auto"
                      onClick={() => {
                        setCreateModal(false);
                      }}
                    >
                      <Info />
                    </button>
                  </div>
                </div>

                <div className=" grid grid-cols-2 gap-2">
                  {/*//* Nombre */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Nombre
                    </div>
                    <InputForm
                      name="nombre"
                      value={formInfo.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  {/*//*Apellido */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Apellido
                    </div>
                    <InputForm
                      name="apellido"
                      value={formInfo.apellido}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className=" grid grid-cols-2 gap-2">
                  {/*//* Cedula */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Cedula
                    </div>
                    <InputForm
                      name="cedula"
                      value={formInfo.cedula}
                      onChange={handleChange}
                    />
                  </div>

                  {/*//* Telefono */}
                  <div>
                    <div className=" text-[12px] text-[#9e9e9e] mb-1">
                      Telefono
                    </div>
                    <InputForm
                      name="telefono"
                      value={formInfo.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/*//* Direccion */}
                <div>
                  <div className=" text-[12px] text-[#9e9e9e] mb-1">
                    Direccion
                  </div>
                  <InputForm
                    name="direccion"
                    value={formInfo.direccion}
                    onChange={handleChange}
                  />
                </div>

                {/*//* Centro de votacion */}
                <div>
                  <div className=" text-[12px] text-[#9e9e9e] mb-1">
                    Centro de votacion
                  </div>
                  <InputForm
                    name="centro_de_votacion"
                    value={formInfo.centro_de_votacion}
                    onChange={handleChange}
                  />
                </div>

                {/*//* Mesa */}
                <div>
                  <div className=" text-[12px] text-[#9e9e9e] mb-1">Mesa</div>
                  <InputForm
                    name="mesa"
                    value={formInfo.mesa}
                    onChange={handleChange}
                  />
                </div>

                {/*//* Activista */}
                <div className=" w-full">
                  <div className=" text-[12px] text-[#9e9e9e] mb-1">
                    Activista
                  </div>
                  <select
                    name="activista"
                    value={formInfo.activista}
                    onChange={handleChange}
                    required
                    className="border  py-[13px] px-1  text-sm focus:border-[#0989FF] focus:outline-none w-full "
                  >
                    <option value="">Seleccione un activista ...</option>
                    {/* Mapping over email array to generate options */}
                    {activistaID.map((email, index) => (
                      <option key={index} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </div>

                {/*//* CREAR button */}
                <button
                  type="submit"
                  className="py-[16px] text-sm mt-2 font-medium tracking-wide text-white w-full text-center transition-all bg-[#0061FE]"
                >
                  <div> Guardar</div>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/*//SECTION: INFO modal // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      {infoModal ? (
        <div className=" fixed w-full h-full bg-[#00000079] glass z-50 top-0 flex justify-center lg:items-center lg:pt-0 pt-[8lvh] px-3">
          <div className="w-full max-w-[400px] bg-white rrr-md flex h-fit lg:-mt-10 relative">
            {/*//* Contenido de la tabla */}
            {infoModal_db.map((item, index) => (
              <div className="relative w-full text-[15px] overflow-hidden">
                <div
                  className=" w-full flex flex-col p-8 my-auto gap-5"
                  key={index}
                >
                  {/*//* Votante + close button */}
                  <div className="flex justify-between items-center w-full">
                    <h1 className=" text-[25px] font-semibold flex items-center ">
                      Votante
                      <button
                        onClick={() => {
                          setDeleteModal(true);
                        }}
                        className={
                          adminID.includes(userState)
                            ? " text-sm font-medium tracking-wide w-full text-center transition-all text-[#d31504] border-l ml-3 pl-3"
                            : "hidden"
                        }
                      >
                        Borrar
                      </button>
                    </h1>

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
                <div className="text-[#0061FE] border-t  font-light  text-[13px] text-center py-2 rrr-br-md rrr-bl-md overflow-x-auto scroll1 justify-center w-full ">
                  {item.activista}
                </div>
              </div>
            ))}

            {/*//* DELETE modal */}
            {deleteModal ? (
              <div className="  absolute w-full h-full text-center font-medium overflow-hidden">
                <h1 className="py-4 bg-white">
                  Esta seguro que desea eliminar este votante?
                </h1>
                <div className="w-full h-full grid grid-cols-2 border-t">
                  <div
                    onClick={() => {
                      //Borra el dato seleccionado de la BD requiere: (nombre de la coleccion, key del campo a borrar, variable donde guardar los datos y nombre del campo por el que se ordenara)
                      firebase_delete("votantes", tempKey, setData, "index");
                      setDeleteModal(false);
                      setInfoModal(false);
                    }}
                    className=" text-lime-500 border-r bg-white py-1 cursor-pointer flex items-center justify-center"
                  >
                    <div className="-mt-20">CONFIRMAR</div>
                  </div>
                  <div
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                    className=" text-rose-600  bg-white py-1 cursor-pointer flex items-center justify-center"
                  >
                    <div className="-mt-20">CANCELAR</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Dashboard;
