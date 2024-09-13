import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../../common/index";

const OtpConfirmation = ({ emailFromSignup }) => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(emailFromSignup || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If email is not coming from props, try getting it from local storage
    if (!emailFromSignup) {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [emailFromSignup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(SummaryApi.otpEmail.url, { email, otp });
      if (res.data.success) {
        setSuccess("Email confirmed successfully!");
        toast.success("Email confirmed successfully!");
        setTimeout(() => {
          navigate("/login"); // Redirect user to login page after confirmation
        }, 2000);
      } else {
        setError(res.data.message);
        toast.error(res.data.message);
      }
    } catch (err) {
      setError("Something went wrong, please try again.");
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          OTP Confirmation
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Confirm OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default OtpConfirmation;
