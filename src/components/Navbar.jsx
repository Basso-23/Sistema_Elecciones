import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Navbar = ({ userState, setUserState }) => {
  //FUNCTION: Cerrar Sesion
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      //* Recargar la página
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <main>
      {/*//SECTION: Navbar container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section className=" flex justify-between py-4">
        <div>LOGO</div>
        {userState ? (
          <div className="flex gap-10 items-center">
            ID: {userState}
            <button
              onClick={handleSignOut}
              className=" px-10 py-1 bg-red-600 text-white uppercase tracking-wide active:scale-95 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default Navbar;
