import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mycart from "./Mycart";
import { auth } from "@/firebase/firebase";
import Router from "next/router";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  signInWithPopup,
} from "firebase/auth";

const Navbar = ({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
  catalogo,
  setCatalogo,
}) => {
  const Nav = ({ name, url }) => {
    return (
      <div>
        <Link
          className={pathname === url ? "text-[#5649e4] " : " text-[#b1b1b1] "}
          href={url}
        >
          {name}
        </Link>
      </div>
    );
  };

  const pathname = usePathname();
  const [cartIsOpen, setCartIsOpen] = useState(false);

  //Console log cada vez que se modifica el carrito
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  //Auth with Google
  async function handleLogin() {
    const googleProvider = new GoogleAuthProvider();
    await signInWithGoogle(googleProvider);
    async function signInWithGoogle(googleProvider) {
      try {
        console.log("antes");
        //Valida si se esta viendo desde un navegador de escritorio o mobile
        if (isMobile()) {
          const res = await signInWithRedirect(auth, googleProvider);
        } else {
          const res = await signInWithPopup(auth, googleProvider);
        }
        console.log("despues");
      } catch (error) {
        console.log(error);
      }
    }
  }

  //Sign Out y redireccion a home
  function handleSignOut() {
    signOut(auth);
  }
  //Detecta si se está viendo desde un navegador web móvil o de escritorio para así poner la autenticación correcta, ya que el popup no se ve en móviles.
  function isMobile() {
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  return (
    <main className="fixed z-[60] shadow-md w-full ">
      {/* Carrito ---------------------------------------------------------------------------------------------- */}
      {cartIsOpen ? (
        <>
          <Mycart
            cart={cart}
            setCart={setCart}
            render={render}
            setRender={setRender}
            userState={userState}
            setUserState={setUserState}
            catalogo={catalogo}
            setCatalogo={setCatalogo}
          />
        </>
      ) : null}

      <section className=" pageSize flex  justify-between h-[80px] items-center z-50 bg-white mx-auto px-5  ">
        <div className=" flex gap-6">
          <Nav name={"Inicio"} url={"/"} />
          <Nav name={"Catalogo"} url={"/Catalogo"} />
        </div>
        <div className=" flex gap-6">
          {userState ? (
            <div className=" flex gap-4">
              <div> {userState}</div>
              <button
                onClick={() => {
                  handleSignOut();
                  setUserState();
                }}
              >
                Cerrar Sesión
              </button>
              <div
                onClick={() => {
                  setCartIsOpen(!cartIsOpen);
                }}
                className=" cursor-pointer select-none"
              >
                🛒 <span>{cart.length}</span>
              </div>
            </div>
          ) : (
            <button onClick={handleLogin}>Identifícate</button>
          )}
        </div>
      </section>
    </main>
  );
};

export default Navbar;
