import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

export function App() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-110px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default App;
