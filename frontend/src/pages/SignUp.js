import React, { useState } from "react";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import pic1 from "../assest/img/pic1.gif";
import loginIcons from "../assest/login.gif";
import SummaryApi from "../common/index";
import imageTobase64 from "../helpers/imageTobase64";

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
  const navigate = useNavigate();
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

    const imagePic = await imageTobase64(file);

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
        method: SummaryApi.signUp.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message, {
          position: "bottom-right",
        });
        navigate("/login");
      }

      if (dataApi.error) {
        toast.error(dataApi.message, {
          position: "bottom-right",
        });
      }
    } else {
      toast.error("Please check password and confirm password");
    }
  };

  return (
    <section id="signup">
      <div className="h-full bg-white-100">
        <div className="mx-auto">
          <div className="flex justify-center px-6 py-12">
            <div className="w-full xl:w-3/4 lg:w-11/12 flex">
              <div className="w-full h-auto bg-gray-200 hidden lg:block lg:w-5/12 lg:h-full bg-cover rounded-l-lg">
                <img
                  src={pic1}
                  alt="pic1"
                  className="object-center mx-auto pt-20 m-20"
                />
              </div>
              <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
                <h3 className="py-4 text-2xl text-center text-gray-800">
                  Create an Account!
                </h3>
                <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
                  <div>
                    <img
                      src={data.profilePic || loginIcons}
                      alt="login-icons"
                    />
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
                <form
                  className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor=""
                      >
                        Full Name
                      </label>
                      <input
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Enter Your Name"
                        name="name"
                        value={data.name}
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                    <div className="md:ml-2">
                      <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor=""
                      >
                        Phone
                      </label>
                      <input
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="tel"
                        placeholder="Enter Phone"
                        name="phone"
                        value={data.phone}
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor=""
                    >
                      Email
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      value={data.email}
                      onChange={handleOnChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor=""
                    >
                      Address
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Enter Address"
                      name="address"
                      value={data.address}
                      onChange={handleOnChange}
                      required
                    />
                  </div>
                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor=""
                      >
                        Password
                      </label>
                      <input
                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        name="password"
                        value={data.password}
                        onChange={handleOnChange}
                      />
                      <div
                        className="cursor-pointer text-xl"
                        onClick={() => setShowPassword((preve) => !preve)}
                      >
                        <span>
                          {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
                        </span>
                      </div>
                    </div>
                    <div className="md:ml-2">
                      <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                        htmlFor=""
                      >
                        Confirm Password
                      </label>
                      <input
                        className="w-full h-fit px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-transparent flex"
                        type={ShowConfirmPassword ? "text" : "password"}
                        placeholder="Enter Confirm Password"
                        name="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleOnChange}
                      />
                      <div
                        className="cursor-pointer text-xl"
                        onClick={() =>
                          setShowConfirmPassword((preve) => !preve)
                        }
                      >
                        <span>
                          {ShowConfirmPassword ? <IoIosEyeOff /> : <IoMdEye />}
                        </span>
                      </div>
                    </div>
                    <Link to={"/forgot-password"} className="hover:underline">
                      {" "}
                      Forgot password
                    </Link>
                  </div>
                  <div className="mb-6 text-center">
                    <button
                      className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Register Account
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="inline-block text-sm text-blue-500 hover:text-blue-800">
                      Already have account ?{" "}
                      <Link
                        to={"/login"}
                        className=" text-red-400 hover:text-red-500 underline "
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
