import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import AdvertisementPopup from "./AdvertisementPopup";
import BottomNavigation from "./BottomNavigation";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";

const ClientLayout = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastPopupTime = localStorage.getItem("lastPopupTime");
    const currentTime = new Date().getTime();

    if (!lastPopupTime || currentTime - lastPopupTime >= 15 * 60 * 1000) {
      setShowPopup(true);
    }

    const resetPopupTimer = () => {
      localStorage.setItem("lastPopupTime", currentTime);
    };

    const events = ["mousemove", "keydown", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, resetPopupTimer);
    });

    return () => {
      // Clean up event listeners on component unmount
      events.forEach((event) => {
        window.removeEventListener(event, resetPopupTimer);
      });
    };
  }, []);

  const handleClosePopup = () => {
    // Set the timestamp to now when closing the popup
    localStorage.setItem("lastPopupTime", new Date().getTime());
    setShowPopup(false); // Hide the popup
  };

  return (
    <div className="flex flex-col min-h-screen text-sm">
      <HeaderClient />
      {!isMobile && <hr className="border border-gray-300" />}

      <main className={`flex-grow overflow-hidden`}>
        <Outlet />
      </main>
      <FooterClient />
      {isMobile && <BottomNavigation />}
      {showPopup && <AdvertisementPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default ClientLayout;
