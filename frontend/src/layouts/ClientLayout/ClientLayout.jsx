import { Analytics } from "@vercel/analytics/react";
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
    // Get the timestamp of the last popup show time from localStorage
    const lastPopupTime = localStorage.getItem("lastPopupTime");
    const currentTime = new Date().getTime(); // Current time in milliseconds

    // Check if the popup has been shown before and if 15 minutes have passed
    if (!lastPopupTime || currentTime - lastPopupTime >= 15 * 60 * 1000) {
      setShowPopup(true); // Show the popup if no popup has been shown or if 15 minutes have passed
    }

    // Set an event listener to track user activity
    const resetPopupTimer = () => {
      localStorage.setItem("lastPopupTime", currentTime); // Update the timestamp in localStorage
    };

    // Add event listeners for user interaction to reset the timer
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
      <Analytics />
      <FooterClient />
      {isMobile && <BottomNavigation />}
      {showPopup && <AdvertisementPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default ClientLayout;
