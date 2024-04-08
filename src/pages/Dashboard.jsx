import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import {
  firebase_delete,
  firebase_edit,
  firebase_read,
  firebase_write,
} from "@/firebase/firebase";

import InputForm from "@/components/InputForm";
import { keyMaker } from "@/components/keyMaker";

import Check from "@/icons/Check";
import Caution from "@/icons/Caution";
import Card from "@/components/Card";
import User from "@/icons/User";
import Clip from "@/icons/Clip";
import Build from "@/icons/Build";
import Si from "@/icons/Si";
import Chart from "@/icons/Chart";
import List from "@/icons/List";
import Filter from "@/icons/Filter";
import Search from "@/icons/Search";
import Sort from "@/icons/Sort";
import Close from "@/icons/Close";

import ProgressBar from "@ramonak/react-progress-bar";
import Card_Chart from "@/components/Card_Chart";
import Question from "@/icons/Question";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();
  const [load, setLoad] = useState(false); //* Se encarga del delay en la carga de la pagina

  const [tempKey, setTempKey] = useState(""); //* TempKey del votante seleccionado

  const [infoModal, setInfoModal] = useState(false); //* Controla la ventana al hacer click en un votante
  const [infoModal_db, setInfoModal_db] = useState(); //* Alamacena la informacion mostrada en el modal de informacion de los votantes

  const [currentPage, setCurrentPage] = useState(1); //* Se almacena la pagina actual en la paginacion
  const [currentOrder, setCurrentOrder] = useState("Por defecto"); //* Orden actual de la tabla

  const [searchTermCedula, setSearchTermCedula] = useState(""); //* Input de buscar por cedula
  const [searchTermActivista, setSearchTermActivista] = useState(""); //* Input de buscar por activista

  const [mobileTable, setMobileTable] = useState("cedula"); //* Controla cual es la tabla que se vera en mobile

  const [data, setData] = useState([]); //* Alamacena la base de datos entera NO se manupula
  const [sortedData, setSortedData] = useState([]); //* Alamacena la base de datos que se van a manipular

  const [deleteModal, setDeleteModal] = useState(false); //* Controla la ventana al hacer click en borrar
  const [createModal, setCreateModal] = useState(false); //* Controla la ventana al hacer click en registrar votante
  const [update, setUpdate] = useState(false); //* Controla los inputs al hacer click en editar

  const [selected, setSelected] = useState(""); //* TempKey para editar campos

  const [votanteExiste, setVotanteExiste] = useState(false); //* Al registrar un nuevo votante contrale si existe ya en la base de datos
  const [votanteExisteEdit, setVotanteExisteEdit] = useState(false); //* Al editar un votante contrale si existe ya en la base de datos

  const [pageToggle, setPageToggle] = useState(true); //* Boton para ir a la pagina de graficas

  const [conteoVotantesSi, setConteoVotantesSi] = useState(0); //* Total de votos si de toda la base de datos

  const [conteoActivistas, setConteoActivistas] = useState([]); //* Total de votantes asignados a cada activista
  const [votosActivistas, setVotosActivistas] = useState([]); //* Total de votos si de votantes asignados a cada activista

  const [conteoEscuelas, setConteoEscuelas] = useState([]); //* Total de votantes asignados a cada escuela
  const [votosEscuelas, setVotosEscuelas] = useState([]); //* Total de votos si de votantes asignados a cada escuela

  const [conteoCombinadoA, setConteoCombinadoA] = useState([]); //* Almacena (votos si de los votantes y total de votantes) asignados de cada activista
  const [conteoCombinadoE, setConteoCombinadoE] = useState([]); //* Almacena (votos si de los votantes y total de votantes) asignados de cada escuela
  const [conteoCombinadoAno, setConteoCombinadoAno] = useState([]);
  const [conteoCombinadoEno, setConteoCombinadoEno] = useState([]);

  const [currentChart, setCurrentChart] = useState("escuela");

  const [searchChartActivista, setSearchChartActivista] = useState("");
  const [searchChartEscuela, setSearchChartEscuela] = useState("");

  const [loader, setLoader] = useState(false);

  const mesas_bd = ["1", "2", "3", "4", "5"]; //* Mesas de la etiqueta select
  //* Escuelas de la etiqueta select
  const escuelas_bd = [
    "escuela 1",
    "escuela 2",
    "escuela 3",
    "escuela 4",
    "escuela 5",
  ];

  const itemsToShow = 50; //* Cantidad de items a mostrar en la tabla

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
    estado_de_votacion: "",
  });

  //FUNCTION: Verifica si la cedula del votante ya esta registrada en la base de datos al crear un nuevo votante
  useEffect(() => {
    const resultadoBusqueda = data.find(
      (item) => item.cedula === formInfo.cedula
    );
    setVotanteExiste(false);
    if (resultadoBusqueda) {
      setVotanteExiste(true);
    }
  }, [formInfo.cedula, data]);

  //FUNCTION: Verifica si la cedula del votante ya esta registrada en la base de datos al editar un votante
  useEffect(() => {
    const resultadoBusqueda = data.find(
      (item) => item.cedula === editInfo.cedula
    );
    setVotanteExisteEdit(false);
    if (resultadoBusqueda) {
      setVotanteExisteEdit(true);
    }
  }, [editInfo.cedula, data]);

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

  //FUNCTION: Maneja el onChange los input de EDIT
  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //FUNCTION: Maneja el submit del form EDIT
  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    setTempKey("");
    setUpdate(false);
    setInfoModal(false);

    if (selected === "nombre") {
      //* Editar nombre
      const info = {
        nombre: editInfo.nombre,
        apellido: editInfo.apellido,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "cedula") {
      //* Editar cedula
      const info = {
        cedula: editInfo.cedula,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "direccion") {
      //* Editar direccion
      const info = {
        direccion: editInfo.direccion,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "telefono") {
      //* Editar telefono
      const info = {
        telefono: editInfo.telefono,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "centro_de_votacion") {
      //* Editar centro de votacion
      const info = {
        centro_de_votacion: editInfo.centro_de_votacion,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "mesa") {
      //* Editar mesa
      const info = {
        mesa: editInfo.mesa,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "activista") {
      //* Editar activista
      const info = {
        activista: editInfo.activista,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    } else if (selected === "estado_de_votacion") {
      //* Editar estado de votacion
      const info = {
        estado_de_votacion: editInfo.estado_de_votacion,
      };
      firebase_edit("votantes", tempKey, info, setData, "index");
    }

    //* Limpiar los campos después de enviar los datos
    editInfo.nombre = "";
    editInfo.apellido = "";
    editInfo.cedula = "";
    editInfo.direccion = "";
    editInfo.telefono = "";
    editInfo.centro_de_votacion = "";
    editInfo.mesa = "";
    editInfo.activista = "";
    editInfo.estado_de_votacion = "";
  };

  //FUNCTION: Se ejecuta al cargar la pagina
  useEffect(() => {
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
      }
      //* NO esta logueado, redirige a Login
      if (!user) {
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
    });

    return () => validateUser();
  }, [router, setUserState]);

  //FUNCTION: Se ejecuta cada vez que la base de datos o TempKey cambian
  useEffect(() => {
    //* Filtra la info de la base de datos segun la key seleccionado y lo almacena en la variable infoModal_db
    const newItems = data.filter((item) => item.key === tempKey);
    setInfoModal_db(newItems);

    //* Suma los votos si de todos los votantes de la base de datos
    const votantesNoFiltered = data.filter(
      (votante) => votante.estado_de_votacion === "si"
    );
    setConteoVotantesSi(votantesNoFiltered.length);

    //* Suma el total votantes asignados a cada activista
    const conteo = data.reduce((acc, votante) => {
      const index = acc.findIndex(
        (item) => item.activista === votante.activista
      );
      if (index !== -1) {
        acc[index].cantidad++;
      } else {
        acc.push({ activista: votante.activista, cantidad: 1 });
      }
      return acc;
    }, []);
    setConteoActivistas(conteo);

    //* Suma los votos "si" de cada activista
    const activistasUnicos = [
      ...new Set(data.map((votante) => votante.activista)),
    ];
    const conteoA = activistasUnicos.map((activista) => {
      const cantidad = data.filter(
        (votante) =>
          votante.activista === activista && votante.estado_de_votacion === "si"
      ).length;
      return { activista, cantidad };
    });
    data.forEach((votante) => {
      if (!conteo.some((item) => item.activista === votante.activista)) {
        conteo.push({ activista: votante.activista, cantidad: 0 });
      }
    });
    setVotosActivistas(conteoA);

    //* Suma el total votantes asignados a cada escuela
    const conteoE = data.reduce((acc, votante) => {
      const index = acc.findIndex(
        (item) => item.centro_de_votacion === votante.centro_de_votacion
      );
      if (index !== -1) {
        acc[index].cantidad++;
      } else {
        acc.push({
          centro_de_votacion: votante.centro_de_votacion,
          cantidad: 1,
        });
      }
      return acc;
    }, []);
    setConteoEscuelas(conteoE);

    //* Suma los votos "si" de cada escuela
    const votosSiPorCentro = data.reduce((acc, votante) => {
      if (votante.estado_de_votacion === "si") {
        const index = acc.findIndex(
          (item) => item.centro_de_votacion === votante.centro_de_votacion
        );
        if (index !== -1) {
          acc[index].cantidad++;
        } else {
          acc.push({
            centro_de_votacion: votante.centro_de_votacion,
            cantidad: 1,
          });
        }
      }
      return acc;
    }, []);
    const todosCentros = data.map((votante) => votante.centro_de_votacion);
    const centrosSinVotos = [
      ...new Set(
        todosCentros.filter(
          (centro) =>
            !votosSiPorCentro.find((item) => item.centro_de_votacion === centro)
        )
      ),
    ];
    const conteoFinal = [
      ...votosSiPorCentro,
      ...centrosSinVotos.map((centro) => ({
        centro_de_votacion: centro,
        cantidad: 0,
      })),
    ];
    setVotosEscuelas(conteoFinal);
  }, [tempKey, data]);

  //FUNCTION: combina los conteos de votos "SÍ" y totales de los activistas
  useEffect(() => {
    const conteoFinal = votosActivistas.map((votoSi) => {
      const votoTotal = conteoActivistas.find(
        (item) => item.activista === votoSi.activista
      );
      return {
        activista: votoSi.activista,
        cantidadS: votoSi.cantidad,
        cantidadT: votoTotal ? votoTotal.cantidad : 0,
      };
    });

    setConteoCombinadoA(conteoFinal);
    setConteoCombinadoAno(conteoFinal);
  }, [votosActivistas, conteoActivistas]);

  //FUNCTION: combina los conteos de votos "SÍ" y totales de las escuelas
  useEffect(() => {
    const conteoFinal = votosEscuelas.map((votoSi) => {
      const votoTotal = conteoEscuelas.find(
        (escuela) => escuela.centro_de_votacion === votoSi.centro_de_votacion
      );
      return {
        centro_de_votacion: votoSi.centro_de_votacion,
        cantidadS: votoSi.cantidad,
        cantidadT: votoTotal ? votoTotal.cantidad : 0,
      };
    });

    setConteoCombinadoE(conteoFinal);
    setConteoCombinadoEno(conteoFinal);
  }, [votosEscuelas, conteoEscuelas]);

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

  //FUNCTION: Actualizar
  const actualizarBD = () => {
    setLoader(true);
    firebase_read("votantes", setData, "index");
    setTimeout(() => {
      setLoader(false);
    }, 250);
  };

  //FUNCTION: Search bar CHART escuela
  const handleChartEscuela = (e) => {
    const searchChartEscuela = e.target.value;
    setSearchChartEscuela(searchChartEscuela);
    const filtered = conteoCombinadoEno.filter((item) =>
      item.centro_de_votacion
        .toLowerCase()
        .includes(searchChartEscuela.toLowerCase())
    );
    setConteoCombinadoE(filtered);
  };

  //FUNCTION: Search bar CHART activista
  const handleChartActivista = (e) => {
    const searchChartActivista = e.target.value;
    setSearchChartActivista(searchChartActivista);
    const filtered = conteoCombinadoAno.filter((item) =>
      item.activista.toLowerCase().includes(searchChartActivista.toLowerCase())
    );
    setConteoCombinadoA(filtered);
  };

  return (
    <main className="pt-8 pb-20">
      {load ? (
        <>
          {pageToggle ? (
            <>
              <div className=" bg-white px-4 pageSize">
                {/*//SECTION: BANNER // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
                <section className=" w-full rounded-sm overflow-hidden shadow text-sm mb-10 ">
                  {/*//* Nota */}
                  <div className="w-full bg-[#CFEEFF] text-[#125486] text-[13px] py-3 px-4 flex font-medium">
                    <span className="mr-[6px] mt-[2px] text-[#125486]">
                      <Question />
                    </span>
                    <div>
                      Nota: Su cuenta tiene permisos como{" "}
                      {adminID.includes(userState) ? (
                        <span>administrador</span>
                      ) : (
                        <span>dirigente</span>
                      )}
                    </div>
                  </div>
                  {/*//* Cuenta y boton de registrar votante */}
                  <div className="w-full bg-white p-4">
                    {/*//* Cuenta */}
                    <h1>
                      Sesión iniciada con la cuenta: {""}
                      <span className=" font-semibold">{userState}</span>
                    </h1>
                    {/*//* Registrar votante button */}
                    <button
                      onClick={() => {
                        setCreateModal(true);
                      }}
                      className={
                        adminID.includes(userState)
                          ? "mt-5 py-[13px] text-[13px] font-medium text-white w-full md:max-w-[150px] text-center transition-all bg-[#0061FE] hover:bg-[#2645e0] rounded-sm"
                          : "hidden"
                      }
                    >
                      <div> Registrar votante</div>
                    </button>
                  </div>
                </section>

                <div
                  className={
                    adminID.includes(userState)
                      ? " lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 grid w-full mb-10 gap-6"
                      : "hidden"
                  }
                >
                  <Card
                    t1={"Votos"}
                    t2={"Total votos conseguidos"}
                    num={conteoVotantesSi}
                    icon={<Si />}
                  />
                  <Card
                    t1={"Votantes"}
                    t2={"Total de votantes"}
                    num={data.length}
                    icon={<User />}
                  />
                  <Card
                    t1={"Centro de votación"}
                    t2={"Centro de votación disponibles"}
                    num={escuelas_bd.length}
                    icon={<Build />}
                  />
                  <Card
                    t1={"Dirigentes"}
                    t2={"Total de dirigentes"}
                    num={activistaID.length}
                    icon={<Clip />}
                  />
                </div>

                {/*//SECTION: SEARCHS INPUTS // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
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
                        placeholder={"buscar por cédula"}
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
                          placeholder={"buscar por dirigente"}
                          type={"text"}
                          onChange={handleSearchActivista}
                        />
                      </div>
                    ) : null}
                  </div>
                </section>

                <div className="flex flex-col w-full ">
                  {/*//SECTION: TABLE DESKTOP // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
                  <section className="hidden md:flex flex-col border-l border-r border-t w-full relative rounded-sm overflow-hidden">
                    {/*//* Titulos de la tabla */}
                    <div className=" w-full grid  grid-cols-5 mt-0  border-b bg-[#F3F6F9] text-[#878AA8] px-4 uppercase py-5 text-[11px] font-semibold tracking-wider">
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
                              : "mr-4 text-[#878AA8]"
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
                              : "mr-4 text-[#878AA8]"
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
                                : "mr-4 text-[#878AA8]"
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
                                : "mr-4 text-[#878AA8]"
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
                              : "mr-4 text-[#878AA8]"
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
                        <div className="select-none">Dirigente</div>
                        <div
                          className={
                            currentOrder === "activista"
                              ? "mr-4 text-[#0061FE]"
                              : "mr-4 text-[#878AA8]"
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
                        <div className="capitalize">
                          {item.nombre} {item.apellido}
                        </div>
                        {/*//* Cédula */}
                        <div className=" w-full">{item.cedula}</div>
                        <div className=" grid grid-cols-2">
                          {/*//* Voto */}
                          <div className="justify-center font-medium w-full">
                            {item.estado_de_votacion === "si" ? (
                              <div className="text-[#7fe502]  ">SI</div>
                            ) : (
                              <div className="text-red-600 ">NO</div>
                            )}
                          </div>
                          {/*//* Mesa */}
                          <div className="justify-center w-full">
                            {item.mesa}
                          </div>
                        </div>
                        {/*//* Centro de Votación */}
                        <div className="">{item.centro_de_votacion}</div>

                        {/*//* Activista */}
                        <div className=" overflow-x-auto scroll1">
                          {item.activista.split("@")[0]}
                        </div>
                      </div>
                    ))}
                  </section>
                  {/*//SECTION: FILTROS MOBILE // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
                  <section className="md:hidden flex flex-col gap-2 text-[13px] mb-5">
                    {/*//* Filtro + Icono */}
                    <div className="uppercase font-semibold  text-[#0061FE] flex ">
                      <Filter />
                      <h1 className=" text-[#0061FE] ">Filtro</h1>
                    </div>

                    {/*//* Filtro: cedula */}
                    <button
                      className={`border py-[13px] px-4 select-none rounded-sm relative ${
                        mobileTable === "cedula"
                          ? " pointer-events-none"
                          : "transition-all bg-[#0061FE] hover:bg-[#2645e0] text-white font-medium border-transparent "
                      }`}
                      onClick={() => {
                        setMobileTable("cedula");
                      }}
                    >
                      Cédula
                      <span
                        className={
                          mobileTable === "cedula"
                            ? "absolute right-5 top-[14px] text-[#0061FE]"
                            : "hidden"
                        }
                      >
                        <Check />
                      </span>
                    </button>
                    {/*//* Filtro: mesa */}
                    <button
                      className={`border py-[13px] px-4 select-none rounded-sm relative  ${
                        mobileTable === "mesa"
                          ? " pointer-events-none"
                          : "transition-all bg-[#0061FE] hover:bg-[#2645e0] text-white font-medium border-transparent "
                      }`}
                      onClick={() => {
                        setMobileTable("mesa");
                      }}
                    >
                      Mesa
                      <span
                        className={
                          mobileTable === "mesa"
                            ? "absolute right-5 top-[14px] text-[#0061FE]"
                            : "hidden"
                        }
                      >
                        <Check />
                      </span>
                    </button>
                    {/*//* Filtro: centro de votacion */}
                    <button
                      className={`border py-[13px] px-4 select-none rounded-sm relative ${
                        mobileTable === "centro"
                          ? " pointer-events-none"
                          : "transition-all bg-[#0061FE] hover:bg-[#2645e0] text-white font-medium border-transparent "
                      }`}
                      onClick={() => {
                        setMobileTable("centro");
                      }}
                    >
                      Centro de votación
                      <span
                        className={
                          mobileTable === "centro"
                            ? "absolute right-5 top-[14px] text-[#0061FE]"
                            : "hidden"
                        }
                      >
                        <Check />
                      </span>
                    </button>
                    {/*//* Filtro: activista */}
                    <button
                      className={`border py-[13px] px-4 select-none rounded-sm relative ${
                        mobileTable === "activista"
                          ? " pointer-events-none"
                          : "transition-all bg-[#0061FE] hover:bg-[#2645e0] text-white font-medium border-transparent "
                      }`}
                      onClick={() => {
                        setMobileTable("activista");
                      }}
                    >
                      Dirigente
                      <span
                        className={
                          mobileTable === "activista"
                            ? "absolute right-5 top-[14px] text-[#0061FE]"
                            : "hidden"
                        }
                      >
                        <Check />
                      </span>
                    </button>
                  </section>
                  {/*//SECTION: TABLE MOBILE // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
                  <section className="md:hidden flex flex-col border-l border-r border-t w-full relative select-none rounded-sm overflow-hidden">
                    {/*//* Titulos de la tabla */}
                    <div className=" w-full grid items-center  grid-cols-3 mt-0  border-b bg-[#F3F6F9] text-[#878AA8] px-2 uppercase py-5 text-[11px] font-semibold tracking-wider">
                      {/*//* Nombre + Apellido */}
                      <button
                        className="flex uppercase tracking-wide justify-between"
                        onClick={() => handleSort("nombre")}
                      >
                        <div>NOMBRE</div>
                        <div
                          className={
                            currentOrder === "nombre"
                              ? "mr-4 text-[#0061FE]"
                              : "mr-4 text-[#878AA8]"
                          }
                        >
                          <Sort />
                        </div>
                      </button>
                      {/*//* Cédula */}
                      <button
                        className={
                          mobileTable === "cedula"
                            ? "flex uppercase tracking-wide justify-between"
                            : "hidden"
                        }
                        onClick={() => handleSort("cedula")}
                      >
                        <div>Cédula</div>
                        <div
                          className={
                            currentOrder === "cedula"
                              ? "mr-2 text-[#0061FE]"
                              : "mr-2 text-[#878AA8]"
                          }
                        >
                          <Sort />
                        </div>
                      </button>

                      {/*//* Mesa */}
                      <button
                        className={
                          mobileTable === "mesa"
                            ? "flex uppercase tracking-wide justify-between"
                            : "hidden"
                        }
                        onClick={() => handleSort("mesa")}
                      >
                        <div>Mesa</div>
                        <div
                          className={
                            currentOrder === "mesa"
                              ? "mr-2 text-[#0061FE]"
                              : "mr-2 text-[#878AA8]"
                          }
                        >
                          <Sort />
                        </div>
                      </button>

                      {/*//* Centro de Votación */}
                      <button
                        className={
                          mobileTable === "centro"
                            ? "flex uppercase tracking-wide justify-between "
                            : "hidden"
                        }
                        onClick={() => handleSort("centro_de_votacion")}
                      >
                        <div className="texto">Centro de Votación</div>
                        <div
                          className={
                            currentOrder === "centro_de_votacion"
                              ? "mr-2 text-[#0061FE]"
                              : "mr-2 text-[#878AA8]"
                          }
                        >
                          <Sort />
                        </div>
                      </button>

                      {/*//* Activista */}
                      <button
                        className={
                          mobileTable === "activista"
                            ? "flex uppercase tracking-wide justify-between "
                            : "hidden"
                        }
                        onClick={() => handleSort("activista")}
                      >
                        <div>Dirigente</div>
                        <div
                          className={
                            currentOrder === "activista"
                              ? "mr-2 text-[#0061FE]"
                              : "mr-2 text-[#878AA8]"
                          }
                        >
                          <Sort />
                        </div>
                      </button>
                      {/*//* Voto */}
                      <button
                        className="flex uppercase tracking-wide justify-between"
                        onClick={() => handleSort("estado_de_votacion")}
                      >
                        <div className="ml-4">Voto</div>
                        <div
                          className={
                            currentOrder === "estado_de_votacion"
                              ? "mr-4 text-[#0061FE]"
                              : "mr-4 text-[#878AA8]"
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
                        <div className=" w-full flex items-center capitalize">
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
                        <div
                          className={
                            mobileTable === "centro" ? "flex" : "hidden"
                          }
                        >
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
                          {item.activista.split("@")[0]}
                        </div>
                        {/*//* Voto */}
                        <div className="justify-center font-medium w-full items-center flex">
                          {item.estado_de_votacion === "si" ? (
                            <span className="text-[#7fe502]   ">SI</span>
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
                      anterior
                    </button>
                    {/*//* Numeros de las paginas */}
                    <div className=" font-bold "> {currentPage}</div>
                    {/*//* Pagina siguiente */}
                    <button
                      onClick={nextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredData.length / itemsToShow)
                      }
                    >
                      siguiente
                    </button>
                  </div>
                </div>
              </div>
              {/*//* Page toggle button */}
              <div
                onClick={() => {
                  setPageToggle(!pageToggle);
                  window.scrollTo(0, 0);
                }}
                className={
                  adminID.includes(userState)
                    ? " w-14 aspect-square rounded-full bg-[#0061FE] hover:bg-[#2645e0] fixed bottom-5 right-5 cursor-pointer transition-all active:scale-95 text-white flex justify-center items-center"
                    : "hidden"
                }
              >
                <Chart />
              </div>
            </>
          ) : (
            <>
              {/*//SECTION: PAGINA DE GRAFICAS  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
              <section className="px-4 pageSize">
                {/*//* BANNER */}
                <div className=" w-full rounded-sm overflow-hidden shadow text-sm ">
                  <div className="w-full bg-[#FFF6E7] text-[#D9A382] text-[13px] py-3 px-4 flex font-medium">
                    {/*//* Icon */}
                    <span className="mr-[6px] mt-[2px] text-[#FFC061]">
                      <Caution />
                    </span>
                    {/*//* Nota */}
                    <div>
                      Nota: Para ver los datos mas recientes es necesario
                      presionar el botón &quot;Actualizar&quot;
                    </div>
                  </div>

                  <div className="w-full bg-white px-4 py-5">
                    {/*//* Votos totales */}
                    <div className=" text-[30px] leading-none font-semibold text-[#0061FE] mb-4 ">
                      {parseInt((conteoVotantesSi * 100) / data.length)}%{" "}
                      <span className="text-[#878A99] text-[13px] font-medium">
                        Votos conseguidos: {conteoVotantesSi}/{data.length}
                      </span>
                    </div>

                    <ProgressBar
                      completed={parseInt(
                        (conteoVotantesSi * 100) / data.length
                      )}
                      maxCompleted={100}
                      bgColor="#0061FE"
                      baseBgColor="#ecebf0"
                      height="8px"
                      isLabelVisible={false}
                    />

                    {/*//* Actualizar BD */}
                    <button
                      onClick={() => {
                        actualizarBD();
                      }}
                      className={`mt-5 py-[13px] text-[13px] font-medium text-white w-full md:max-w-[150px] text-center transition-all  rounded-sm ${
                        loader
                          ? "bg-[#cbcbcb] pointer-events-none"
                          : "bg-[#ffa825] hover:bg-[#eea02b]"
                      }`}
                    >
                      {/*//*Loader */}
                      {loader ? (
                        <div className=" flex relative justify-center ">
                          <div className="lds-ellipsis -ml-14 ">
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      ) : (
                        <div> Actualizar </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className=" md:flex md:flex-row flex flex-col-reverse gap-5 mt-10 w-full">
                  <section className="w-full md:max-w-[350px]">
                    {/*//* Filtro + Icono */}
                    <div className=" uppercase font-semibold  text-[#0061FE] flex text-[13px] ">
                      <Filter />
                      <h1 className=" text-[#0061FE] ">Filtro</h1>
                    </div>{" "}
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[13px] md:max-w-[350px]">
                      <button
                        className={`border py-[13px] px-3 select-none rounded-sm relative ${
                          currentChart === "escuela"
                            ? " pointer-events-none flex gap-2"
                            : "transition-all bg-[#0061FE] hover:bg-[#2645e0] text-white font-medium border-transparent flex"
                        }`}
                        onClick={() => {
                          setCurrentChart("escuela");
                        }}
                      >
                        <div> Centro de votación </div>

                        <span
                          className={
                            currentChart === "escuela"
                              ? "absolute right-3 top-[14px] text-[#0061FE]"
                              : "hidden"
                          }
                        >
                          <Check />
                        </span>
                      </button>
                      <button
                        className={`border py-[13px] px-3 select-none rounded-sm relative${
                          currentChart === "activista"
                            ? " pointer-events-none flex gap-2"
                            : "transition-all bg-[#0061FE] hover:bg-[#2645e0] text-white font-medium border-transparent flex"
                        }`}
                        onClick={() => {
                          setCurrentChart("activista");
                        }}
                      >
                        <div> Dirigentes </div>
                        <span
                          className={
                            currentChart === "activista"
                              ? "absolute right-3 top-[14px] text-[#0061FE]"
                              : "hidden"
                          }
                        >
                          <Check />
                        </span>
                      </button>
                    </div>
                  </section>
                  {/*//SECTION: SEARCHS INPUTS // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
                  <section className="w-full md:max-w-[300px]">
                    {/*//* Buscar + Icono */}
                    <div className="uppercase font-semibold text-[13px] mb-2 text-[#0061FE] flex items-center">
                      <Search />
                      <h1 className=" text-[#0061FE] ml-1">Buscar</h1>
                    </div>
                    {/*//* Input buscar por cédula...*/}
                    <div className=" md:flex gap-5">
                      {currentChart === "escuela" ? (
                        <div className=" md:max-w-[300px] w-full">
                          <InputForm
                            name=""
                            value={searchChartEscuela}
                            placeholder={"buscar por centro de votación"}
                            type={"text"}
                            onChange={handleChartEscuela}
                          />
                        </div>
                      ) : (
                        <div className=" md:max-w-[300px] w-full">
                          <InputForm
                            name=""
                            value={searchChartActivista}
                            placeholder={"buscar por dirigente"}
                            type={"text"}
                            onChange={handleChartActivista}
                          />
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {currentChart === "escuela" ? (
                  <div className="mt-10">
                    {/*//* Votos de las escuelas */}
                    <div className=" mt-5 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 grid w-full gap-6">
                      {conteoCombinadoE.map(
                        ({ centro_de_votacion, cantidadS, cantidadT }) => (
                          <div key={centro_de_votacion}>
                            <Card_Chart
                              t1={centro_de_votacion}
                              actual={cantidadS}
                              total={cantidadT}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-10">
                    {/*//* Votos de activistas */}
                    <div className=" mt-5 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 grid w-full gap-6">
                      {conteoCombinadoA.map(
                        ({ activista, cantidadS, cantidadT }) => (
                          <div
                            key={activista}
                            className=" w-full rounded-sm border"
                          >
                            <div className=" border-b p-3 font-semibold text-[13px] uppercase">
                              {activista.split("@")[0]}
                            </div>
                            <div className=" w-full px-3 py-5">
                              <div className=" flex gap-4 mb-2 items-center">
                                <div className=" text-[20px] leading-none">
                                  {parseInt((cantidadS * 100) / cantidadT)}%
                                </div>
                                <div className="text-[#878A99] text-[13px] font-medium">
                                  Votos conseguidos: {cantidadS}/{cantidadT}
                                </div>
                              </div>

                              <ProgressBar
                                completed={(cantidadS * 100) / cantidadT}
                                maxCompleted={100}
                                bgColor="#0061FE"
                                baseBgColor="#ecebf0"
                                height="8px"
                                isLabelVisible={false}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/*//* Page toggle button */}
                <div
                  onClick={() => {
                    setPageToggle(!pageToggle);
                    window.scrollTo(0, 0);
                  }}
                  className=" w-14 aspect-square rounded-full bg-[#0061FE] hover:bg-[#2645e0] fixed bottom-5 right-5 cursor-pointer transition-all active:scale-95 text-white flex justify-center items-center"
                >
                  <List />
                </div>
              </section>
            </>
          )}
        </>
      ) : null}

      {/*//SECTION: CREAR MODAL // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      {createModal ? (
        <div className=" fixed w-full h-full bg-[#00000079] glass z-50 top-0 flex justify-center lg:items-center lg:pt-0 pt-[8lvh] px-3">
          <div className="w-full max-w-[400px] bg-white mb-10 flex h-fit lg:-mt-10">
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
                      <Close />
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
                    {votanteExiste ? (
                      <div className=" text-[11px] text-[#9e0032] mt-1 texto">
                        Este votante ya esta registrado.
                      </div>
                    ) : null}
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

                  <select
                    name="centro_de_votacion"
                    value={formInfo.centro_de_votacion}
                    onChange={handleChange}
                    required
                    className="border cursor-pointer py-[13px] px-1  text-sm focus:border-[#0989FF] focus:outline-none w-full rounded-sm "
                  >
                    <option value="">Ninguno</option>
                    {escuelas_bd.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/*//* Mesa */}
                <div>
                  <div className=" text-[12px] text-[#9e9e9e] mb-1">Mesa</div>
                  <select
                    name="mesa"
                    value={formInfo.mesa}
                    onChange={handleChange}
                    required
                    className="border cursor-pointer py-[13px] px-1  text-sm focus:border-[#0989FF] focus:outline-none w-full rounded-sm "
                  >
                    <option value="">Ninguno</option>
                    {mesas_bd.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/*//* Activista */}
                <div className=" w-full">
                  <div className=" text-[12px] text-[#9e9e9e] mb-1">
                    Dirigente
                  </div>
                  <select
                    name="activista"
                    value={formInfo.activista}
                    onChange={handleChange}
                    required
                    className="border cursor-pointer py-[13px] px-1  text-sm focus:border-[#0989FF] focus:outline-none w-full rounded-sm "
                  >
                    <option value="">Ninguno</option>
                    {activistaID.map((email, index) => (
                      <option key={index} value={email}>
                        {email.split("@")[0]}
                      </option>
                    ))}
                  </select>
                </div>

                {/*//* Guardar button */}
                <button
                  type="submit"
                  className={`py-[16px] text-sm mt-2 font-medium tracking-wide text-white w-full text-center transition-all rounded-sm  ${
                    votanteExiste
                      ? "bg-[#F0F0F0] pointer-events-none"
                      : " bg-[#0061FE]"
                  }`}
                >
                  <div> Guardar</div>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/*//SECTION: VOTANTE INFO MODAL // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      {infoModal ? (
        <div className=" fixed w-full h-full bg-[#00000079] glass z-50 top-0 flex justify-center lg:items-center lg:pt-0 pt-[8lvh] px-3">
          <div className="w-full max-w-[400px] bg-white rounded-sm overflow-hidden flex h-fit lg:-mt-10 relative">
            {/*//* Contenido de la tabla */}
            {infoModal_db.map((item, index) => (
              <div
                key={index}
                className="relative w-full text-[15px] overflow-hidden"
              >
                <div className=" w-full flex flex-col py-8 px-10 my-auto gap-5">
                  {/*//* Votante + close button */}
                  <div className="flex justify-between items-center w-full">
                    <h1 className=" text-[25px] font-semibold flex items-center ">
                      Votante
                      <button
                        onClick={() => {
                          setDeleteModal(true);
                        }}
                        className={
                          adminID.includes(userState) && !update
                            ? " text-[15px] font-medium tracking-wide w-full text-[#d31504] text-center border-l ml-3 pl-3"
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
                          setUpdate(false);
                        }}
                      >
                        <Close />
                      </button>
                    </div>
                  </div>
                  <form
                    onSubmit={handleSubmitEdit}
                    className="w-full flex flex-col my-auto gap-5"
                  >
                    <div>
                      {/*//* Nombre + Apellido */}
                      {update && selected === "nombre" ? (
                        <div className=" grid grid-cols-2 gap-2">
                          {/*//* Nombre */}
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Nombre
                            </div>
                            <InputForm
                              name="nombre"
                              value={editInfo.nombre}
                              placeholder={item.nombre}
                              onChange={handleChangeEdit}
                            />
                          </div>
                          {/*//*Apellido */}
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Apellido
                            </div>
                            <InputForm
                              name="apellido"
                              value={editInfo.apellido}
                              placeholder={item.apellido}
                              onChange={handleChangeEdit}
                            />
                          </div>

                          <button
                            className="w-fit text-[#d31504]"
                            onClick={() => {
                              setUpdate(false);
                            }}
                          >
                            Cerrar
                          </button>
                          <button
                            className="text-end w-fit ml-auto text-[#0061FE]"
                            type="submit"
                          >
                            Guardar
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Nombre
                          </div>
                          <div className=" flex justify-between">
                            <div className=" capitalize">
                              {item.nombre} {item.apellido}
                            </div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("nombre");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "nombre" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      {/*//* Cedula */}
                      {update && selected === "cedula" ? (
                        <div className=" grid grid-cols-1 gap-2">
                          {/*//*Cedula */}
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Cedula
                            </div>
                            <InputForm
                              name="cedula"
                              value={editInfo.cedula}
                              placeholder={item.cedula}
                              onChange={handleChangeEdit}
                            />
                            {votanteExisteEdit ? (
                              <div className=" text-[11px] text-[#9e0032] mt-1 texto">
                                Este votante ya esta registrado.
                              </div>
                            ) : null}
                          </div>
                          <div className="grid grid-cols-2">
                            <button
                              className="w-fit text-[#d31504]"
                              onClick={() => {
                                setUpdate(false);
                              }}
                            >
                              Cerrar
                            </button>
                            <button
                              className={`text-end w-fit ml-auto  ${
                                votanteExisteEdit
                                  ? " text-[#c2c2c2] pointer-events-none"
                                  : " text-[#0061FE]"
                              }`}
                              type="submit"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Cedula
                          </div>
                          <div className=" flex justify-between">
                            <div>{item.cedula}</div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("cedula");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "cedula" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/*//* Telefono */}
                    <div>
                      {update && selected === "telefono" ? (
                        <div className=" grid grid-cols-1 gap-2">
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Telefono
                            </div>
                            <InputForm
                              name="telefono"
                              value={editInfo.telefono}
                              placeholder={item.telefono}
                              onChange={handleChangeEdit}
                            />
                          </div>
                          <div className="grid grid-cols-2">
                            <button
                              className="w-fit text-[#d31504]"
                              onClick={() => {
                                setUpdate(false);
                              }}
                            >
                              Cerrar
                            </button>
                            <button
                              className="text-end w-fit ml-auto text-[#0061FE]"
                              type="submit"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Telefono
                          </div>
                          <div className=" flex justify-between">
                            <div>{item.telefono}</div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("telefono");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "telefono" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/*//* Direccion */}
                    <div>
                      {update && selected === "direccion" ? (
                        <div className=" grid grid-cols-1 gap-2">
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Direccion
                            </div>
                            <InputForm
                              name="direccion"
                              value={editInfo.direccion}
                              placeholder={item.direccion}
                              onChange={handleChangeEdit}
                            />
                          </div>
                          <div className="grid grid-cols-2">
                            <button
                              className="w-fit text-[#d31504]"
                              onClick={() => {
                                setUpdate(false);
                              }}
                            >
                              Cerrar
                            </button>
                            <button
                              className="text-end w-fit ml-auto text-[#0061FE]"
                              type="submit"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Direccion
                          </div>
                          <div className=" flex justify-between">
                            <div>{item.direccion}</div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("direccion");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "direccion" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/*//* Centro de votacion */}
                    <div>
                      {update && selected === "centro_de_votacion" ? (
                        <div className=" grid grid-cols-1 gap-2">
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Centro de votacion
                            </div>

                            <select
                              name="centro_de_votacion"
                              value={editInfo.centro_de_votacion}
                              onChange={handleChangeEdit}
                              required
                              className="border cursor-pointer py-[13px] px-1  text-sm focus:border-[#0989FF] focus:outline-none w-full rounded-sm "
                            >
                              <option value="">Ninguno</option>
                              {escuelas_bd.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2">
                            <button
                              className="w-fit text-[#d31504]"
                              onClick={() => {
                                setUpdate(false);
                              }}
                            >
                              Cerrar
                            </button>
                            <button
                              className="text-end w-fit ml-auto text-[#0061FE]"
                              type="submit"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Centro de votacion
                          </div>
                          <div className=" flex justify-between">
                            <div>{item.centro_de_votacion}</div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("centro_de_votacion");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "centro_de_votacion" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/*//* Mesa */}
                    <div className=" w-full">
                      {update && selected === "mesa" ? (
                        <div className=" grid grid-cols-1 gap-2">
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Mesa
                            </div>

                            <select
                              name="mesa"
                              value={editInfo.mesa}
                              onChange={handleChangeEdit}
                              required
                              className="border cursor-pointer py-[13px] px-1  text-sm focus:border-[#0989FF] focus:outline-none w-full rounded-sm "
                            >
                              <option value="">Ninguno</option>
                              {mesas_bd.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2">
                            <button
                              className="w-fit text-[#d31504]"
                              onClick={() => {
                                setUpdate(false);
                              }}
                            >
                              Cerrar
                            </button>
                            <button
                              className="text-end w-fit ml-auto text-[#0061FE]"
                              type="submit"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Mesa
                          </div>
                          <div className=" flex justify-between">
                            <div>{item.mesa}</div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("mesa");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "mesa" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/*//* Voto */}
                    <div className=" w-full">
                      {update && selected === "estado_de_votacion" ? (
                        <div className=" grid grid-cols-1 gap-2">
                          <div>
                            <div className=" text-[12px] text-[#9e9e9e] mb-1">
                              Voto
                            </div>

                            <select
                              name="estado_de_votacion"
                              value={editInfo.estado_de_votacion}
                              onChange={handleChangeEdit}
                              required
                              className="border  py-[13px] px-1 cursor-pointer  text-sm focus:border-[#0989FF] focus:outline-none w-full rounded-sm "
                            >
                              <option value="">Eliga una opcion</option>
                              <option value="si">SI</option>
                              <option value="no">NO</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2">
                            <button
                              className="w-fit text-[#d31504]"
                              onClick={() => {
                                setUpdate(false);
                              }}
                            >
                              Cerrar
                            </button>
                            <button
                              className="text-end w-fit ml-auto text-[#0061FE]"
                              type="submit"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className=" text-[12px] text-[#9e9e9e] mb-1">
                            Voto
                          </div>
                          <div className=" flex justify-between">
                            <div className="justify-center font-medium w-full">
                              {item.estado_de_votacion === "si" ? (
                                <div className="text-[#7fe502]  ">SI</div>
                              ) : (
                                <div className="text-red-600 ">NO</div>
                              )}
                            </div>
                            <div
                              className={
                                adminID.includes(userState)
                                  ? " flex "
                                  : "hidden"
                              }
                            >
                              <button
                                onClick={() => {
                                  setSelected("estado_de_votacion");
                                  setUpdate(true);
                                }}
                                className={
                                  selected != "estado_de_votacion" && update
                                    ? "text-[#c2c2c2] pointer-events-none"
                                    : "text-[#0061FE]"
                                }
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </div>

                {/*//* Activista */}
                <div className="text-[#707070] border-t  font-light  text-[13px] text-center py-2 rrr-br-md rrr-bl-md overflow-x-auto scroll1 justify-center w-full ">
                  {item.activista.split("@")[0]}
                </div>
              </div>
            ))}

            {/*//SECTION: DELETE MODAL // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
            {deleteModal ? (
              <div className="  absolute w-full h-full text-center text-sm bg-white flex flex-col items-center px-6">
                <div className=" alert aspect-square h-20 mt-32"></div>
                {/*//* Titulo */}
                <div>
                  <h1 className=" text-2xl font-medium mt-2">
                    Borrar votante?
                  </h1>
                  <h2 className=" text-[#858585] mt-2">
                    ¿Estás seguro de que deseas eliminar este artículo? Esta
                    acción no se puede deshacer.
                  </h2>
                </div>
                {/*//* Botones */}
                <div className="w-full grid grid-cols-1 gap-3 mt-10">
                  <div
                    onClick={() => {
                      firebase_delete("votantes", tempKey, setData, "index");
                      setDeleteModal(false);
                      setInfoModal(false);
                    }}
                    className=" text-white bg-[#F24646] font-medium cursor-pointer flex items-center justify-center py-4 rounded-sm"
                  >
                    <div className="">Borrar</div>
                  </div>
                  <div
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                    className=" text-[#6B6E7F] bg-[#F0F0F0] font-medium py-4 cursor-pointer flex items-center justify-center rounded-sm"
                  >
                    <div className="">Cancelar</div>
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
