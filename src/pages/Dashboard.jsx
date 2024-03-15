import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = ({ userState, setUserState }) => {
  const router = useRouter();
  //FUNCTION: Valida que exista un usuario
  const userValidate = () => {
    if (!userState) {
      router.push("/");
    }
  };

  //FUNCTION: Se ejecuta al cargar la pagina
  useEffect(() => {
    userValidate();
  }, []);

  return (
    <main>
      <div>Dashboard</div> <div>{userState}</div>
    </main>
  );
};

export default Dashboard;
