import React, { useState } from "react";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import loginIcons from "../assest/login.gif";
import SummaryApi from "../common/index";
import imageProfile from "../helpers/imageProfile";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [ShowConfirmPassword, setShowConfirmPassword] = useState(true);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleUploadPic = async (e) => {
    const file = e.target.files[0];

    const imagePic = await imageProfile(file);

    setData((preve) => {
      return {
        ...preve,
        profilePic: imagePic,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(SummaryApi.signUp.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const data_ = await dataResponse.json();
      console.log("data", data_);
    } else {
      console.log("Please check password and confirm password");
    }
  };
  console.log("data login", data);

  return (
    <section id="signup">
      <div className="max-auto container p-4">
        <div className="bg-white p-2 py-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <div>
              <img src={data.profilePic || loginIcons} alt="login-icons" />
            </div>
            <form>
              <label>
                <div className="text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 text-center absolute bottom-0 w-full cursor-pointer">
                  Upload Photo
                </div>
                <input
                  type="file"
                  className="hidden"
                  onClick={handleUploadPic}
                />
              </label>
            </form>
          </div>
          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label htmlFor="">Name: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>
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
            <div className="grid">
              <label htmlFor="">Phone: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="number"
                  placeholder="Enter Phone"
                  name="phone"
                  value={data.phone}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="grid">
              <label htmlFor="">Address: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Enter Address"
                  name="address"
                  value={data.address}
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
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  <span>{showPassword ? <IoIosEyeOff /> : <IoMdEye />}</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="">Confirm Password: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={ShowConfirmPassword ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowConfirmPassword((preve) => !preve)}
                >
                  <span>
                    {ShowConfirmPassword ? <IoIosEyeOff /> : <IoMdEye />}
                  </span>
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
              Sign Up
            </button>
          </form>
          <p className="my-5">
            Already have account ?{" "}
            <Link
              to={"/login"}
              className=" text-red-400 hover:text-red-500 underline "
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
