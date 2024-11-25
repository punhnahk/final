import React from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import WrapperContent from "../../components/WrapperContent/WrapperContent";

const FooterClient = () => {
  return (
    <footer className="bg-gradient-to-r bg-black">
      <WrapperContent>
        <div className="text-white py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CONNECT WITH US */}
          <div>
            <p className="font-semibold text-base mb-2">CONNECT WITH US</p>
            <div className="flex gap-3 mt-2">
              <Link
                to="https://facebook.com/noellll.2003"
                target="_blank"
                className="text-white hover:text-blue-600 transition-all"
              >
                <FaFacebook className="text-lg" />
              </Link>
              <Link
                to="https://youtube.com"
                target="_blank"
                className="text-white hover:text-red-600 transition-all"
              >
                <FaYoutube className="text-lg" />
              </Link>
            </div>
          </div>

          {/* ABOUT US */}
          <div>
            <p className="font-semibold text-base mb-2">ABOUT US</p>
            <div className="leading-5 space-y-2">
              <Link
                className="text-xs text-white hover:text-gray-400 transition-all"
                to="/overview"
              >
                Project Overview
              </Link>
              <br />
              <Link
                className="text-xs text-white hover:text-gray-400 transition-all"
                to="/payment-guide"
              >
                Purchase & Online Payment Guide
              </Link>
            </div>
          </div>

          {/* POLICIES */}
          <div>
            <p className="font-semibold text-base mb-2">POLICIES</p>
            <div className="leading-5 space-y-2">
              <Link
                className="text-xs text-white hover:text-gray-400 transition-all"
                to="/policies"
              >
                View All Policies
              </Link>
            </div>
          </div>

          {/* PAYMENT SUPPORT */}
          <div>
            <p className="font-semibold text-base mb-2">Payment Support</p>
            <div className="flex gap-2 items-center">
              <img
                src="https://cdn2.fptshop.com.vn/svg/vnpay_icon_ba16ea588c.svg"
                alt="Payment Support"
                className="h-[28px] transition-all transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </WrapperContent>

      {/* COPYRIGHT */}
      <div className="py-3 border-t border-[#ffffff33] text-[#cbd1d6] text-xs">
        <WrapperContent className="leading-5 text-center">
          <span>© 2024 - Final Year Project - Phung Huu Minh Khanh</span>
          <span className="mx-1">&#x2022;</span>
          <span>
            Local: University of Greenwich Viet Nam, Campus Da Nang City
          </span>
        </WrapperContent>
      </div>
    </footer>
  );
};

export default FooterClient;
