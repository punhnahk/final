import React, { useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { Outlet } from "react-router-dom";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";

const SocialButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="fixed bottom-5 right-3">
      <div
        className="relative flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-blue-600"
        onClick={() => setIsClicked(!isClicked)}
      >
        <FaMessage size={20} />
        {isClicked && (
          <div className="absolute bottom-full mb-2 right-3 flex flex-col items-center space-y-2 transition-all duration-300">
            <a
              href="https://zalo.me/0879400321"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
            >
              <AiFillMessage size={20} />
            </a>
            <a
              href="https://m.me/388093741061744"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const ClientLayout = () => {
  return (
    <>
      <HeaderClient />
      <Outlet />
      {<SocialButton />}
      <FooterClient />
    </>
  );
};

export default ClientLayout;
