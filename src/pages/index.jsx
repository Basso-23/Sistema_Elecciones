import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import InputForm from "@/components/InputForm";

const Login = ({ userState, setUserState }) => {
  const router = useRouter();
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

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

  //FUNCTION: Maneja el onChange los input de LOGIN
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormLogin((prevState) => ({ ...prevState, [name]: value }));
  };

  //FUNCTION: Maneja el submit del form LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formLogin.email,
        formLogin.password
      );
      const user = userCredential.user;

      //* Asigna la key del usuario a la variable userState
      setUserState(user.uid);
      //* Redirige a Dashboard
      router.push("/Dashboard");
    } catch (error) {
      console.log("Error al iniciar sesión:", error);
    }
  };

  return (
    <main className=" flex justify-center items-center min-h-screen bg-[#FAFAFA] px-3">
      {/*//SECTION: Form container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section className=" aspect-[10/8.5] w-full max-w-[650px] bubble flex justify-center items-center min-h-[455px]">
        <form
          className="flex flex-col justify-center gap-5 items-center bg-white p-10 w-full max-w-[390px] shadow-md rounded-lg text-center relative"
          onSubmit={handleLogin}
        >
          <div className=" w-[80px] aspect-square rounded-full absolute fixedCenterX bg-[#4A77F7] top-0 -mt-10"></div>
          <h1 className=" text-xl font-bold mb-2 pt-6">
            Sign up and get access to the full guide right now
          </h1>
          <InputForm
            name="email"
            value={formLogin.email}
            placeholder={"Email"}
            type={"email"}
            onChange={handleChange}
          />

          <InputForm
            name="password"
            value={formLogin.password}
            placeholder={"Contraseña"}
            type={"password"}
            onChange={handleChange}
          />

          <button
            className=" px-10 py-2 text-sm font-medium tracking-wide bg-[#4A77F7] text-white mt-2 rounded-md w-full text-center"
            type="submit"
          >
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
