import "@/styles/globals.css";
import React, { useState, useEffect } from "react";

const App = ({ Component, pageProps, router }) => {
  return (
    <div>
      <Component key={router.pathname} {...pageProps} />
    </div>
  );
};

export default App;
