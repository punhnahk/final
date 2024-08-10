import React, { useState } from "react";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { setUserDetails } from "../store/userSlice";
import Logo from "./Logo";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  console.log("user header", user);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.userLogout.url, {
      method: SummaryApi.userLogout.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };
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
          <div
            className="relative flex justify-center"
            onClick={() => setMenuDisplay((preve) => !preve)}
          >
            <div className="text-3xl cursor-pointer relative flex justify-center">
              {user?.profilePic ? (
                <img
                  src={user?.profilePic}
                  className="w-10 h-10 rounded-full"
                  alt={user.name}
                />
              ) : (
                <FaUserAlt />
              )}
            </div>
            {menuDisplay && (
              <div className="absolute bg-white bottom-0 top-12 h-fit p-4 shadow-lg rounded">
                <nav>
                  <Link
                    to={"admin-panel"}
                    className="whitespace-nowrap hover:bg-slate-100 p-2"
                  >
                    Admin Panel
                  </Link>
                </nav>
              </div>
            )}
          </div>
          <div className="text-4xl relative">
            <span>
              <FaShoppingCart />
            </span>
            <div className="bg-red-600 text-white w-5 h-5 p-1 rounded-full flex items-center justify-center absolute top-0 -right-2">
              <p className="text-xs">0</p>
            </div>
          </div>
          {user?._id ? (
            <button
              className="text-sm px-2 py-1 rounded-full text-white  bg-red-500 hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              to={"/login"}
              className="px-2 py-1 rounded-full text-white  bg-red-500 hover:bg-red-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
