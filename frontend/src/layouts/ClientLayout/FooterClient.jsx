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
            </div>
            <p className="font-semibold mt-4 mb-2">Our Store Location</p>
            <div className="h-[180px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15337.013754847163!2d108.22588995!3d16.052332999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421827a3c439f5%3A0xdec2fb897aa16a90!2sGreenwich%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1730205961534!5m2!1svi!2s"
                width="70%"
                height="70%"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
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
              <Link className="text-sm" to="/policies">
                View All Policies
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
