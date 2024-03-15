import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Navbar = ({ userState, setUserState }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Recargar la página
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  return (
    <main>
      <div className=" flex justify-between">
        <div>LOGO</div>
        <div className="flex gap-10">
          <div>{userState}</div>
          <button onClick={handleSignOut}>Cerrar Sesión</button>
        </div>
      </div>
    </main>
  );
};

export default Navbar;
