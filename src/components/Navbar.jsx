import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";

const Navbar = ({ userState, setUserState }) => {
  const router = useRouter();
  //FUNCTION: Cerrar Sesion
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      //* Redirige a Inicio
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    clean();
  };

  //FUNCTION: Limpia la variable que guarda el ID del usuario
  const clean = () => {
    setUserState();
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
