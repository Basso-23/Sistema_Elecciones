import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Vote from "@/icons/Vote";

const Navbar = ({ userState, setUserState, adminID, activistaID }) => {
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
    <main className=" bg-white border-b z-50 fixed w-full sm:h-[70px] h-[50px] flex items-center">
      {/*//SECTION: Navbar container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section className="flex justify-between py-4 sm:px-4 pageSize w-full">
        <div className="flex gap-3 items-center">
          {/*//* Logo */}
          <div className=" sm:w-10 sm:h-10 w-[50px] h-[50px] bg-[#0061FE] justify-center items-center flex text-white p-[7px]">
            <Vote />
          </div>
          {/*//* Titulo */}
          <div className=" sm:flex hidden text-xl font-bold -tracking-wide ">
            Registro de votantes
          </div>
        </div>

        {userState ? (
          <div className="flex gap-4 items-center sm:px-0 px-4">
            {/*//* Tipo de usuario */}
            <div className="  text-[#0061FE] text-[13px] font-semibold">
              {adminID.includes(userState) ? <div>ADMIN</div> : null}
              {activistaID.includes(userState) ? <div>DIRIGENTE</div> : null}
            </div>
            {/*//* Cerrar Sesión */}
            <button
              onClick={handleSignOut}
              className=" border-l pl-4 text-sm tracking-wide transition-all hover:text-[#0061FE]"
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
