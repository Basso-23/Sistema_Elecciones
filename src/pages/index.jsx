import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Login = ({ userState, setUserState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  //FUNCTION: Valida si el usuario esta logueado
  useEffect(() => {
    const validateUser = onAuthStateChanged(auth, (user) => {
      // NO esta logueado lo manda a inicio
      if (!user) {
        console.log("user.uid:", user);
        if (router.pathname !== "/") {
          router.push("/");
        }
      }
      // SI esta logueado se asigna la key a la variable userState
      if (user) {
        console.log("user.uid:", user.uid);
      }
    });

    return () => validateUser();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
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
      <section>
        <form className="gap-5 flex" onSubmit={handleSignIn}>
          <div>
            <label>Email:</label>
            <input
              className="border"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              className="border"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Iniciar Sesión</button>
        </form>
        {error && <p>{error}</p>}
      </section>
    </main>
  );
};

export default Login;
