import { message, Spin } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import orderApi from "../../../api/orderApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";

const VNPayReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const vnpayTxnRef = searchParams.get("vnp_TxnRef");

  useEffect(() => {
    if (!responseCode || !vnpayTxnRef) return;

    if (responseCode === "00") {
      handleUpdateOrderStatus();
    } else {
      message.error("Payment failed");
      navigate(ROUTE_PATH.HOME);
    }
  }, [responseCode, vnpayTxnRef]);

  const handleUpdateOrderStatus = async () => {
    try {
      const splitTxnRef = vnpayTxnRef.split("_");
      const orderId = splitTxnRef[splitTxnRef.length - 1];

      await orderApi.updateStatus({
        id: orderId,
        status: ORDER_STATUS.CONFIRMED,
        paymentStatus: PAYMENT_STATUS.PAID,
      });

      navigate(ROUTE_PATH.ORDER_SUCCESS);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <WrapperContent className="min-h-[60vh] flex justify-center items-center">
      <Spin className="w-full h-full max-w-[400px] sm:max-w-[300px] m-auto" />
    </WrapperContent>
  );
};

export default VNPayReturn;
