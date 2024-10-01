import { ORDER_STATUS, PAYMENT_STATUS } from "../constants";

export const getOrderStatus = (status) => {
  switch (status) {
    case ORDER_STATUS.INITIAL:
      return "Order placed successfully";
    case ORDER_STATUS.CONFIRMED:
      return "Confirmed";
    case ORDER_STATUS.DELIVERING:
      return "Delivering";
    case ORDER_STATUS.DELIVERED:
      return "Delivered";
    case ORDER_STATUS.CANCELED:
      return "Canceled";
    default:
      return "";
  }
};

export const getOrderPaymentStatus = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return "Paid";
    case PAYMENT_STATUS.UNPAID:
      return "Unpaid";
    default:
      return "";
  }
};
