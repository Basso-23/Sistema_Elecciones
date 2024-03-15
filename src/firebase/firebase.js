import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
//Declarar las variables en .env.local y tambien en next.config
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);

//FUNCTION: Almacena los datos a la BD requiere: (nombre de la coleccion, info a guardar, variable donde guardar los datos y nombre del campo por el que se ordenara)
export const firebase_write = async (coleccion, info, save, order) => {
  //* Guardar los datos en Firestore
  await setDoc(doc(db, coleccion, info.key), info);

  //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
  firebase_read(coleccion, save, order);
};

//FUNCTION: Lee y asigna los datos de la BD requiere: (nombre de la coleccion, variable donde guardar los datos y nombre del campo por el que se ordenara)
export const firebase_read = async (coleccion, save, order) => {
  await getDocs(query(collection(db, coleccion), orderBy(order, "desc"))).then(
    (querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //* Asigna los datos leídos de la base de datos
      save(newData);
    }
  );
};

//FUNCTION: Borra el dato seleccionado de la BD requiere: (nombre de la coleccion, key del campo a borrar, variable donde guardar los datos y nombre del campo por el que se ordenara)
export const firebase_delete = async (coleccion, key, save, order) => {
  await deleteDoc(doc(db, coleccion, key));
  console.log("Articulo borrado", key);
  //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
  firebase_read(coleccion, save, order);
};

//FUNCTION: Actualiza el dato seleccionado de la BD requiere: (nombre de la coleccion, key del campo a editar, info a guardar, variable donde guardar los datos y nombre del campo por el que se ordenara)
export const firebase_edit = async (coleccion, key, info, save, order) => {
  await updateDoc(doc(db, coleccion, key), info);

  //* Lee y asigna los datos de la base de datos requiere: (nombre de la coleccion, variable donde guardar los datos, orden al guardar)
  firebase_read(coleccion, save, order);
};
