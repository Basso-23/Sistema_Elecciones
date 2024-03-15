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

  useEffect(() => {
    console.log("USUARIO:", userState);
  }, [userState]);

  //FUNCTION: Valida si el usuario esta logueado
  useEffect(() => {
    const validateUser = onAuthStateChanged(auth, (user) => {
      //* NO esta logueado lo manda a inicio
      if (!user) {
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
      //* SI esta logueado se asigna la key a la variable userState
      if (user) {
        if (router.pathname === "/") {
          router.push("/Dashboard");
        }
        setUserState(user.uid);
        console.log("user.uid:", user.uid);
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
      setUserState(user.uid);
      router.push("/Dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className=" flex justify-center items-center min-h-screen">
      {/*//SECTION: Form container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section>
        <form className="flex gap-5 items-center" onSubmit={handleLogin}>
          <label>
            <InputForm
              name="email"
              value={formLogin.email}
              placeholder={"Email"}
              type={"email"}
              onChange={handleChange}
            />
          </label>
          <label>
            <InputForm
              name="password"
              value={formLogin.password}
              placeholder={"Contraseña"}
              type={"password"}
              onChange={handleChange}
            />
          </label>
          <button
            className=" px-10 py-1 bg-lime-500 text-white uppercase tracking-wide active:scale-95 transition-all"
            type="submit"
          >
            Iniciar Sesión
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
