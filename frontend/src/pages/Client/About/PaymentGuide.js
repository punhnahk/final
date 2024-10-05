import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";

const PaymentGuide = () => {
  return (
    <WrapperContent>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item>
          <Link className="text-[#1250dc] font-medium" to={ROUTE_PATH.HOME}>
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="font-medium">
          Purchase & Online Payment Guide
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">
          Purchase & Online Payment Guide
        </h1>
        <h2 className="text-lg font-semibold mb-2">How to Purchase</h2>
        <p className="leading-8">Follow these steps to complete a purchase:</p>
        <ul className="list-disc ml-6 leading-8">
          <li>Select your desired products and add them to the cart.</li>
          <li>Proceed to checkout after reviewing your cart.</li>
          <li>Fill in your shipping information and confirm your order.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-4 mb-2">
          Online Payment with VNPay
        </h2>
        <p className="leading-8">
          We support secure payments via VNPay. Here's a guide:
        </p>
        <ol className="list-decimal ml-6 leading-8">
          <li>Select VNPay as your payment method during checkout.</li>
          <li>You will be redirected to VNPay's secure payment gateway.</li>
          <li>Follow the instructions to complete the transaction.</li>
          <li>Once completed, you will receive a confirmation email.</li>
        </ol>

        <p className="leading-8 mt-4">
          If you encounter any issues during payment, please contact our support
          team.
        </p>
      </div>
    </WrapperContent>
  );
};

export default PaymentGuide;
