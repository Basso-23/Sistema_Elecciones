import { useRouter } from "next/router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Dashboard = ({ userState, setUserState, adminID, activistaID }) => {
  const router = useRouter();

  //FUNCTION: Se ejecuta al cargar la pagina
  useEffect(() => {
    console.log("USUARIO:", userState);
  }, [userState]);

  //FUNCTION: Valida si el usuario esta logueado
  useEffect(() => {
    const validateUser = onAuthStateChanged(auth, (user) => {
      //* SI esta logueado se asigna la key del usuario a la variable userState y no puede ver la pantalla de Login
      if (user) {
        if (router.pathname === "/") {
          router.push("/Dashboard");
        }
        setUserState(user.uid);
        console.log("user.uid:", user.uid);
      }
      //* NO esta logueado, redirige a Login
      if (!user) {
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
    });

    return () => validateUser();
  }, []);

  return (
    <main>
      <section className=" flex flex-col gap-5 justify-center items-center min-h-screen">
        <div>Dashboard</div> <div>USUARIO: {userState}</div>
        {adminID.includes(userState) ? (
          <div className=" font-bold text-lime-500">ADMIN</div>
        ) : null}
        {activistaID.includes(userState) ? (
          <div className=" font-bold  text-sky-600">ACTIVISTA</div>
        ) : null}
      </section>
    </main>
  );
};

export default Dashboard;
