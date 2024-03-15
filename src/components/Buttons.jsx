import React, { useState, useEffect } from "react";
import Router from "next/router";
import { collection, getDocs, addDoc } from "firebase/firestore";
const Buttons = ({ name, action, data, modifier, id }) => {
  return (
    <div
      onClick={() => {
        //Si "action" existe ejecutara la accion, de lo contrario significa que el usuario no esta logeado y lo rediccionara a la pagina de login
        if (action) {
          action(data, id, modifier);
        } else {
          //Redireccion a la pagina de login
          Router.push("/LoginScreen");
        }
      }}
      className=" text-center bg-orange-500 text-white uppercase py-2 text-sm font-medium cursor-pointer w-full select-none"
    >
      {name}
    </div>
  );
};

export default Buttons;
