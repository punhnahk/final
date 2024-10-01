import React, { useEffect } from "react";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { message, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/routes";
import orderApi from "../../../api/orderApi";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../constants";

const VNPayReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const vnpayTxnRef = searchParams.get("vnp_TxnRef");

  useEffect(() => {
    if (!responseCode || !vnpayTxnRef) return;

    if (responseCode === "00") {
      handleUpdateOrderStt();
    } else {
      message.error("Thanh toán thất bại");
      navigate(ROUTE_PATH.HOME);
    }
  }, [responseCode, vnpayTxnRef]);

  const handleUpdateOrderStt = async () => {
    try {
      const splitTnxRef = vnpayTxnRef.split("_");
      const orderId = splitTnxRef[splitTnxRef.length - 1];

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
    <WrapperContent className="min-h-[60vh] flex">
      <Spin className="m-auto" />
    </WrapperContent>
  );
};

export default VNPayReturn;
