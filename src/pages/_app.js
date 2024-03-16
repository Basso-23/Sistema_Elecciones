import "@/styles/globals.css";
import "@fontsource-variable/inter";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const App = ({ Component, pageProps, router }) => {
  //* Almacena la el ID del usuario al iniciar sesion
  const [userState, setUserState] = useState();
  //* Almacena los ID de los ADMIN
  const [adminID, setAdminID] = useState(
    process.env.ADMIN_ID ? JSON.parse(process.env.ADMIN_ID) : []
  );
  //* Almacena los ID de los ACTIVISTAS
  const [activistaID, setActivistaID] = useState(
    process.env.ACTIVISTA_ID ? JSON.parse(process.env.ACTIVISTA_ID) : []
  );
  return (
    <div style={{ fontFamily: "Inter Variable, sans-serif" }}>
      <Navbar userState={userState} setUserState={setUserState} />

      <div className={userState ? " sm:pt-[70px] pt-[50px]" : " pt-[0px]"}>
        <Component
          key={router.pathname}
          {...pageProps}
          userState={userState}
          setUserState={setUserState}
          adminID={adminID}
          activistaID={activistaID}
        />
      </div>
    </div>
  );
};

export default App;
