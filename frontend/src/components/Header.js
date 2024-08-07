import React from "react";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="h-16 shadow-md bg-white">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className="">
          <Link to={"/"}>
            <Logo w={100} h={100} />
          </Link>
        </div>
        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow-md pl-2">
          <input
            type="text"
            placeholder="Search product here ..."
            className="w-full outline-none"
          />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full">
            <IoSearchSharp />
          </div>
        </div>
        <div className="flex items-center gap-7">
          <div className="text-3xl cursor-pointer">
            <FaUserAlt />
          </div>
          <div className="text-4xl relative">
            <span>
              <FaShoppingCart />
            </span>
            <div className="bg-red-600 text-white w-5 h-5 p-1 rounded-full flex items-center justify-center absolute top-0 -right-2">
              <p className="text-xs">0</p>
            </div>
          </div>

          <Link
            to={"/login"}
            className="px-2 py-1 rounded-full text-white  bg-red-500 hover:bg-red-700"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
