import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Dashboard = ({ userState, setUserState }) => {
  const router = useRouter();

  useEffect(() => {
    console.log("USER STATE", userState);
  }, [userState]);

  //FUNCTION: Valida si el usuario esta logueado
  useEffect(() => {
    const validateUser = onAuthStateChanged(auth, (user) => {
      // NO esta logueado lo manda a inicio
      if (!user) {
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
      // SI esta logueado se asigna la key a la variable userState
      if (user) {
        setUserState(user.uid);
        console.log("user.uid:", user.uid);
      }
    });

    return () => validateUser();
  }, []);

  return (
    <main>
      <div>Dashboard</div> <div>{userState}</div>
    </main>
  );
};

export default Dashboard;
