import React from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import WrapperContent from "../../components/WrapperContent/WrapperContent";

const FooterClient = () => {
  return (
    <footer className="bg-[#090d14]">
      <WrapperContent>
        <div className="text-white py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-semibold">CONNECT WITH US</p>
            <div className="flex gap-4 mt-3">
              <Link to="https://facebook.com/noellll.2003" target="_blank">
                <FaFacebook className="text-xl" />
              </Link>
              <Link to="https://youtube.com" target="_blank">
                <FaYoutube className="text-xl" />
              </Link>
              {/* <Link to="https://tiktok.com" target="_blank">
                <FaTiktok className="text-xl" />
              </Link> */}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-3">ABOUT US</p>
            <p className="leading-8">
              <Link className="text-sm" to="/overview">
                Project Overview
              </Link>
            </p>
            <p className="leading-8">
              <Link className="text-sm" to="/payment-guide">
                Purchase & Online Payment Guide
              </Link>
            </p>
          </div>

          <div>
            <p className="font-semibold mb-3">POLICIES</p>
            <p className="leading-8">
              <Link className="text-sm">Warranty Policy</Link>
            </p>
            <p className="leading-8">
              <Link className="text-sm">Privacy Policy</Link>
            </p>
            <p className="leading-8">
              <Link className="text-sm">
                Personal Data Collection & Processing Policy
              </Link>
            </p>
          </div>

          <div>
            <p className="font-semibold mb-3">Payment Support</p>
            <div className="flex gap-1 flex-wrap">
              <img
                src="https://cdn2.fptshop.com.vn/svg/vnpay_icon_ba16ea588c.svg"
                alt="Payment"
                className="h-[30px]"
              />
            </div>
          </div>
        </div>
      </WrapperContent>

      <div className="py-6 border-t border-[#ffffff33] text-[#cbd1d6] text-sm">
        <WrapperContent className="leading-6 text-center">
          <span>© 2024 - Final Year Project - Phung Huu Minh Khanh</span>
          <span className="mx-2">&#x2022;</span>
          <span>
            Local: University of Greenwich Viet Nam, Campus Da Nang City
          </span>
        </WrapperContent>
      </div>
    </footer>
  );
};

export default FooterClient;
