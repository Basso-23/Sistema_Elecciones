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
    <main className=" flex justify-center min-h-[100lvh] px-6">
      {/*//SECTION: Form container // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // */}
      <section className="mt-[120px] h-fit w-full justify-center flex">
        <form
          className="flex flex-col gap-5 w-full sm:max-w-[390px] sm:min-w-[350px] "
          onSubmit={handleLogin}
        >
          {/*//* Titulo */}
          <h1 className=" text-[25px] font-semibold mb-2 pt-6">
            Inicia sesión
          </h1>
          {/*//* Input correo electrónico */}
          <div>
            <div className=" text-[12px] text-[#9e9e9e] mb-1">
              Correo electrónico
            </div>
            <InputForm
              name="email"
              value={formLogin.email}
              placeholder={""}
              type={"email"}
              onChange={handleChange}
            />
          </div>
          {/*//* Input contraseña */}
          <div>
            <div className=" text-[12px] text-[#9e9e9e] mb-1">Contraseña</div>
            <InputForm
              name="password"
              value={formLogin.password}
              placeholder={""}
              type={"password"}
              onChange={handleChange}
            />
          </div>
          {/*//* Submit button */}
          <button
            className=" px-10 py-[16px] text-sm font-medium tracking-wide bg-[#0061FE] hover:bg-[#2645e0] text-white mt-5 w-full text-center glowLogin transition-all"
            type="submit"
          >
            Continuar
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
