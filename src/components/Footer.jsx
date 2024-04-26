import Phone from "@/icons/Phone";
import React, { useState, useEffect } from "react";

const Footer = () => {
  return (
    <main className="w-full border-t bg-[#F8FAFF] ">
      <section className=" pageSize px-4 flex flex-col items-center  justify-center pt-4">
        <div className="flex gap-2 items-center">
          <div
            className="bg-contain bg-center w-[60px]  aspect-[10/5] bg-no-repeat hidden"
            style={{
              backgroundImage:
                "url('https://i.imgur.com/CzlwmDN.pngtu_url_de_imagen')",
            }}
          ></div>
          <div
            className="bg-contain bg-center w-[120px]  aspect-[10/5] bg-no-repeat"
            style={{
              backgroundImage: "url('https://i.imgur.com/KePacDj.png')",
            }}
          ></div>
        </div>

        <div
          className="bg-contain bg-center w-[105px]  aspect-[10/5] bg-no-repeat"
          style={{
            backgroundImage: "url('https://i.imgur.com/UyoAvKn.png')",
          }}
        ></div>
      </section>
      <section className=" pb-4">
        <div className="flex  flex-col  justify-center  mt-4 text-center pageSize text-[13px] px-4 text-[#5d5d5d]">
          <div className=" flex items-center gap-1 justify-center">
            <div> Creado por</div>
            <strong className="text-[#000000]">Carlos Baso /</strong>

            <strong className="text-[#000000]"> 6203-5672</strong>
          </div>
          <div className=" mt-1">©2024 Todos los derechos reservados.</div>
        </div>
      </section>
    </main>
  );
};

export default Footer;
