import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common/index";

const ConfirmEmail = () => {
  const { token } = useParams(); // Get the token from the URL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(
          `${SummaryApi.confirmEmail.url}/${token}`,
          {
            method: "GET",
          }
        );

        const data_ = await response.json();

        if (data_.success) {
          toast.success(data_.message, {
            position: "bottom-right",
          });
        } else {
          toast.error(data_.message, {
            position: "bottom-right",
          });
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again later.", {
          position: "bottom-right",
        });
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Confirming your email, please wait...</p>
    </div>
  );
};

export default ConfirmEmail;
