import React, { useState } from "react";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import { Link, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import loginIcons from "../assest/login.gif";
import SummaryApi from "../common/index";
const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigation();
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const data_ = await dataResponse.json();
    if (data_.success) {
      toast.success(data_.message);
      navigate("/");
    }
    if (data_.error) {
      toast.error(data_.message);
    }
  };
  console.log("data login", data);

  return (
    <section id="login">
      <div className="max-auto container p-4">
        <div className="bg-white p-2 py-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login-icons" />
          </div>
          <form action="" className="pt-6" onSubmit={handleSubmit}>
            <div className="grid">
              <label htmlFor="">Email: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="">Password: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  <span>{showPassword ? <IoIosEyeOff /> : <IoMdEye />}</span>
                </div>
              </div>
              <Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline"
              >
                {" "}
                Forgot password
              </Link>
            </div>
            <button className="bg-red-400 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4">
              Login
            </button>
          </form>
          <p className="my-5">
            Don't have account ?{" "}
            <Link
              to={"/signup"}
              className=" text-red-400 hover:text-red-500 underline "
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
