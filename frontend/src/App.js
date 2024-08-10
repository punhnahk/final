import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import SummaryApi from "./common/index";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Context from "./context/index";
import { setUserDetails } from "./store/userSlice";

export function App() {
  const dispatch = useDispatch();
  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: "include",
    });
    const data_ = await dataResponse.json();
    if (data_.success) {
      dispatch(setUserDetails(data_.data));
    }
    console.log("data-user", dataResponse);
  };
  useEffect(() => {
    fetchUserDetails();
  });
  return (
    <Context.Provider
      value={{
        fetchUserDetails, //user detail fetch request
      }}
    >
      <ToastContainer limit={5} transition={Slide} draggable stacked />
      <Header />
      <main className="min-h-[calc(100vh-110px)]">
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}
export default App;
