import React, { useRef, useEffect, useState, useContext } from "react";
import Nav from "./Nav";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";


const Layout = ({ children }) => {

  return (
    <>
      <Header />
      <div className="container flex flex-col min-h-screen p-5">
        <Nav />
        <div className="flex flex-col items-center justify-center flex-grow w-full gap-5">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
