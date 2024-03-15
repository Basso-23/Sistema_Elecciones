import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { products_db } from "@/json/products_db";

const ProductInfo = ({ cart, setCart, render, setRender }) => {
  const router = useRouter();
  const [product, setProduct] = useState([]);

  const id = router.query.id;
  //console.log(id, "ID");

  useEffect(() => {
    const newItems = products_db.filter((item) => item.key === id);
    setProduct(newItems);
  }, [id]);

  return (
    <div className=" flex">
      <div className="m-auto text-sm flex flex-col gap-6">
        {product.map((item) => (
          <div key={item.key} className="mt-10">
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
