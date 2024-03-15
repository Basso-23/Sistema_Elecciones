import React, { useState, useEffect, useRef } from "react";
import InputForm from "@/components/InputForm";
import { keyMaker } from "@/components/keyMaker";
import {
  firebase_delete,
  firebase_edit,
  firebase_read,
  firebase_write,
} from "@/firebase/firebase";

const CrearUsuario = () => {
  const [tempKey, setTempKey] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [data, setData] = useState([]);

  const [formInfo, setFormInfo] = useState({
    nombre: "",
    apellido: "",
  });

  const [editInfo, setEditInfo] = useState({
    nombre: "",
    apellido: "",
  });

  //FUNCTION: Lee la base de datos al cargar la pagina
  useEffect(() => {
    //* Lee y asigna los datos de la BD requiere: (nombre de la coleccion, variable donde guardar los datos y nombre del campo por el que se ordenara)
    firebase_read("usuarios", setData, "index");
  }, []);

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
    };

    //* Almacena los datos a la BD requiere: (nombre de la coleccion, info a guardar, variable donde guardar los datos y nombre del campo por el que se ordenara)
    firebase_write("usuarios", info, setData, "index");

    //* Limpiar los campos después de enviar los datos
    formInfo.nombre = "";
    formInfo.apellido = "";
  };

  //FUNCTION: Maneja el onChange los input de EDIT
  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  //FUNCTION: Maneja el submit del form EDIT
  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    //* Cierra el modal de editar
    setUpdateModal(false);

    //* Definir la info a enviar
    const info = {
      nombre: editInfo.nombre,
      apellido: editInfo.apellido,
    };

    //* Actualiza el dato seleccionado de la BD requiere: (nombre de la coleccion, key del campo a editar, info a guardar, variable donde guardar los datos y nombre del campo por el que se ordenara)
    firebase_edit("usuarios", tempKey, info, setData, "index");

    //* Limpiar los campos después de enviar los datos
    editInfo.nombre = "";
    editInfo.apellido = "";
  };

  return (
    <main className=" mt-10">
      {/*//SECTION: Form container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <form className="flex gap-5 items-center" onSubmit={handleSubmit}>
          <label>
            <InputForm
              name="nombre"
              value={formInfo.nombre}
              placeholder={"Nombre"}
              onChange={handleChange}
            />
          </label>
          <label>
            <InputForm
              name="apellido"
              value={formInfo.apellido}
              placeholder={"Apellido"}
              onChange={handleChange}
            />
          </label>
          <button
            className=" px-10 py-1 bg-lime-500 text-white uppercase tracking-wide active:scale-95 transition-all"
            type="submit"
          >
            Crear Usuario
          </button>
        </form>
      </section>

      {/*//SECTION: Map de los datos // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <div className=" mt-20 flex flex-col gap-10">
          {data.map((item, index) => (
            <div className=" w-fit" key={index}>
              <form
                className=" flex gap-5 relative"
                onSubmit={handleSubmitEdit}
              >
                <div className="w-[500px] grid grid-cols-3">
                  {updateModal && tempKey == item.key ? (
                    <>
                      <label>
                        <InputForm
                          name="nombre"
                          value={editInfo.nombre}
                          placeholder={item.nombre}
                          onChange={handleChangeEdit}
                        />
                      </label>
                      <label>
                        <InputForm
                          name="apellido"
                          value={editInfo.apellido}
                          placeholder={item.apellido}
                          onChange={handleChangeEdit}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="border-b border-transparent">
                        {item.nombre}
                      </div>
                      <div className="border-b border-transparent">
                        {item.apellido}
                      </div>
                    </>
                  )}
                  <div>{item.index}</div>
                </div>

                {updateModal && tempKey == item.key ? (
                  <>
                    <button
                      type="submit"
                      className=" cursor-pointer select-none"
                    >
                      ✅
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        setTempKey(item.key);
                        setUpdateModal(!updateModal);
                      }}
                      className={
                        updateModal || deleteModal
                          ? " pointer-events-none grayscale select-none"
                          : "cursor-pointer select-none"
                      }
                    >
                      ✏️
                    </div>
                  </>
                )}
                <div
                  onClick={() => {
                    setTempKey(item.key);
                    setDeleteModal(true);
                  }}
                  className={
                    updateModal || deleteModal
                      ? " pointer-events-none grayscale select-none"
                      : "cursor-pointer select-none"
                  }
                >
                  🗑️
                </div>
                {updateModal && tempKey == item.key ? (
                  <button
                    onClick={() => {
                      setUpdateModal(false);
                    }}
                    className=" cursor-pointer select-none font-medium  tracking-wide text-rose-600 "
                  >
                    CLOSE
                  </button>
                ) : null}
                {deleteModal && tempKey == item.key ? (
                  <div className="  absolute w-full  grid grid-cols-2 gap-6 text-center tracking-wide">
                    <div
                      onClick={() => {
                        //Borra el dato seleccionado de la BD requiere: (nombre de la coleccion, key del campo a borrar, variable donde guardar los datos y nombre del campo por el que se ordenara)
                        firebase_delete("usuarios", tempKey, setData, "index");
                        setDeleteModal(false);
                      }}
                      className=" bg-lime-500 text-white py-1 cursor-pointer"
                    >
                      CONFIRMAR
                    </div>
                    <div
                      onClick={() => {
                        setDeleteModal(false);
                      }}
                      className=" bg-rose-600  text-white py-1 cursor-pointer"
                    >
                      CANCELAR
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CrearUsuario;
