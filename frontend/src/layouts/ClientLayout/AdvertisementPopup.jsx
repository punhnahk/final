import { message } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import voucherApi from "../../api/voucherApi";

const AdvertisementPopup = ({ onClose }) => {
  const [email, setEmail] = useState(""); // State to store the email input by the user
  const [isLoading, setIsLoading] = useState(false); // State to track the loading state
  const [voucherId, setVoucherId] = useState(null); // State to store the voucher ID

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const { data } = await voucherApi.getVouchers();
        const currentDate = new Date();

        const nearestVoucher = data.reduce((closest, current) => {
          const currentExpiry = new Date(current.expirationDate);
          if (currentExpiry > currentDate) {
            if (!closest || currentExpiry < new Date(closest.expirationDate)) {
              return current;
            }
          }
          return closest;
        }, null);

        if (nearestVoucher) {
          setVoucherId(nearestVoucher._id); // Set the nearest voucher ID
        } else {
          message.warning("No valid vouchers available at the moment."); // If no voucher is found
        }
      } catch (error) {
        message.error("Error fetching vouchers. Please try again.");
      }
    };

    fetchVouchers();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendVoucher = async () => {
    if (!email) {
      message.error("Please enter your email!"); // Show error message if email is empty
      return;
    }

    if (!voucherId) {
      message.error("Voucher not available!"); // Ensure there's a voucher before sending
      return;
    }

    try {
      setIsLoading(true);
      await voucherApi.sendVoucher(voucherId, email); // Use the dynamically selected voucher ID
      message.success("Promo code has been sent to your email!"); // Show success message
      onClose(); // Close the popup after sending the voucher
    } catch (error) {
      message.error("An error occurred. Please try again!"); // Show error message in case of failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 relative">
        <div className="mb-4">
          <img
            src="/images/popup.jpg" // Replace with your image path
            alt="Promo"
            className="w-full h-auto rounded-lg mb-4"
          />
        </div>
        <h2 className="text-xl font-semibold mb-4">Get Your Promo Code Now!</h2>

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          onClick={handleSendVoucher}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white transition ${
            isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Sending..." : "Send Promo Code"}
        </button>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-3xl text-gray-500 hover:text-gray-700"
        >
          <IoIosCloseCircleOutline />
        </button>
      </div>
    </div>
  );
};

export default AdvertisementPopup;
