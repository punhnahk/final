import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 py-4">
      <WrapperContent className="bg-white min-h-[60vh] flex items-center justify-center rounded-lg">
        <Result
          status="success"
          title="Order placed successfully!"
          subTitle="Noel Techshop staff will contact you within 5-10 minutes to confirm your order."
          extra={[
            <Button
              type="primary"
              key="continue"
              onClick={() => navigate(ROUTE_PATH.PRODUCTS_LIST)}
            >
              Continue Shopping
            </Button>,
            <Button key="home" onClick={() => navigate(ROUTE_PATH.HOME)}>
              Back to Home
            </Button>,
          ]}
        />
      </WrapperContent>
    </div>
  );
};

export default OrderSuccess;
