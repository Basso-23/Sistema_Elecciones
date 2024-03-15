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

      // Guardar el estado de autenticación en el almacenamiento local
      localStorage.setItem("userState", user.uid);
      router.push("/Dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    console.log("PRIMERO", userState);
    const value = localStorage.getItem("userState") || undefined;
    setUserState(value);
    console.log("DESPUES", userState);
  }, [userState]);

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
