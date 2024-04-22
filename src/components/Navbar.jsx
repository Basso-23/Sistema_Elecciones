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
        <div className="flex gap-2 items-center">
          <div
            className="bg-contain bg-center w-[60px]  aspect-[10/5] bg-no-repeat md:flex hidden"
            style={{
              backgroundImage:
                "url('https://i.imgur.com/CzlwmDN.pngtu_url_de_imagen')",
            }}
          ></div>
          <div
            className="bg-contain bg-center w-[120px]  aspect-[10/5] bg-no-repeat md:ml-0 ml-2 mt-1"
            style={{
              backgroundImage: "url('https://i.imgur.com/KePacDj.png')",
            }}
          ></div>

          <div className=" -mt-1 border-l pl-5 ml-3 hidden">
            <div
              className="bg-contain bg-center w-[105px]  aspect-[10/5] bg-no-repeat"
              style={{
                backgroundImage: "url('https://i.imgur.com/UyoAvKn.png')",
              }}
            ></div>
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
