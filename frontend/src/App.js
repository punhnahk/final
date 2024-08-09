import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import SummaryApi from "./common/index";
import Footer from "./components/Footer";
import Header from "./components/Header";

export function App() {
  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: "include",
    });
    const data_ = await dataResponse.json();
    console.log("data-user", dataResponse);
  };
  useEffect(() => {
    fetchUserDetails();
  });
  return (
    <>
      <ToastContainer />
      <Header />
      <main className="min-h-[calc(100vh-110px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default App;
