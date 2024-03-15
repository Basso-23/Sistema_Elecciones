import React, { useState, useEffect, useRef } from "react";
import Buttons from "@/components/Buttons";

const Mycart = ({
  cart,
  setCart,
  render,
  setRender,
  userState,
  setUserState,
  catalogo,
  setCatalogo,
}) => {
  //Importante: Valor unico del JSON: key
  //JSON que esta cambiando: cart
  //Cambiar estas dos cosas de ser necesario
  const deleteItem = (toDelete) => {
    //Filtra el JSON dejando todos los objetos excepto el que objeto que dentro de "item.key" posee el mismo valor que recibe de "toDelete"
    const newItems = cart.filter((item) => item.key !== toDelete);
    //Actualiza la info del carrito
    setCart(newItems);
  };

  const plusQty = (toFind) => {
    //Busca en "item.key" si el valor que recibe de "toFind" existe en el JSON del carrito
    if (cart.find((item) => item.key == toFind)) {
      const updatedItems = cart;
      //Encuentra el index del valor a cambiar
      const objIndex = cart.findIndex((item) => item.key == toFind);
      //Aumenta la qty del producto
      updatedItems[objIndex].qty += 1;
      //Actualiza la info del carrito
      setCart(updatedItems);
      console.log(cart);
      //Importante: Rerender al JSON
      setRender(!render);
    } else {
      console.log("NO existe");
    }
  };

  const minusQty = (toFind) => {
    //Busca en "item.key" si el valor que recibe de "toFind" existe en el JSON del carrito
    if (cart.find((item) => item.key == toFind)) {
      const updatedItems = cart;
      //Encuentra el index del valor a cambiar
      const objIndex = cart.findIndex((item) => item.key == toFind);
      //Controla que la cantidad no pueda ser cero o negativa
      if (updatedItems[objIndex].qty !== 1) {
        //Disminuye la qty del producto
        updatedItems[objIndex].qty -= 1;
        //Actualiza la info del carrito
        setCart(updatedItems);
        //Importante: Rerender al JSON
        setRender(!render);
      } else {
        console.log("La cantidad no puede ser CERO");
      }
    } else {
      console.log("NO existe");
    }
  };
  return (
    //Carrito container
    <section className=" fixed w-[400px] h-screen bg-black left-0 top-0 z-[60] flex flex-col overflow-x-auto gap-10 items-center">
      {cart
        .map((item) => (
          <div key={item.key}>
            <div className="flex ">
              {/* Image */}
              <div
                style={{ backgroundImage: `url(${item.cover})` }}
                className="aspect-[10/14.8] w-[200px] bg-cover bg-no-repeat"
              ></div>

              <div className=" my-auto ml-6">
                {/* Price */}
                {/* "item.price * item.qty" el precio por la cantidad, ".toFixed(2)" es para que se vea con 2 decimales  */}
                <div className="mt-4 text-white text-center">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                {/* Sizes */}
                <div className="flex gap-6 my-6">
                  {item.available_sizes.map((data) => (
                    <div
                      key={data.key}
                      className={
                        item.size === data.option
                          ? "border border-orange-500 px-4 py-2 text-orange-500 mx-auto select-none"
                          : "hidden"
                      }
                    >
                      {data.option}
                    </div>
                  ))}
                </div>
                {/* Qty */}
                <div className=" text-white text-center mt-4">{item.qty}</div>
                <div className="flex gap-6 max-h-10 w-24 mt-4 mx-auto">
                  {/* Disminuir qty */}
                  <Buttons
                    name={"-"}
                    action={userState ? minusQty : false}
                    data={item.key}
                  />
                  {/* Aumentar qty */}
                  <Buttons
                    name={"+"}
                    action={userState ? plusQty : false}
                    data={item.key}
                  />
                </div>

                <div className=" w-full mt-4">
                  {/* Delete from cart */}
                  <Buttons
                    name={"Delete"}
                    action={userState ? deleteItem : false}
                    data={item.key}
                  />
                </div>
              </div>
            </div>
          </div>
        ))
        .reverse()}
    </section>
  );
};

export default Mycart;
