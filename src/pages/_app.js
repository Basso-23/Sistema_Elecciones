import "@/styles/globals.css";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const App = ({ Component, pageProps, router }) => {
  const [userState, setUserState] = useState();
  const [adminID, setAdminID] = useState(
    process.env.ADMIN_ID ? JSON.parse(process.env.ADMIN_ID) : []
  );
  const [activistaID, setActivistaID] = useState(
    process.env.ACTIVISTA_ID ? JSON.parse(process.env.ACTIVISTA_ID) : []
  );
  return (
    <div className="pageSize mx-auto">
      <Navbar userState={userState} setUserState={setUserState} />
      <Component
        key={router.pathname}
        {...pageProps}
        userState={userState}
        setUserState={setUserState}
        adminID={adminID}
        activistaID={activistaID}
      />
    </div>
  );
};

export default App;
