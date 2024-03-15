import "@/styles/globals.css";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const App = ({ Component, pageProps, router }) => {
  const [userState, setUserState] = useState();
  return (
    <div className="pageSize mx-auto">
      <Navbar userState={userState} setUserState={setUserState} />
      <Component
        key={router.pathname}
        {...pageProps}
        userState={userState}
        setUserState={setUserState}
      />
    </div>
  );
};

export default App;
