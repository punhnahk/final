import React, { createContext, useState } from "react";
import { saveCartToOrder, viewOrders } from "../api/orderAPI"; // API functions for orders

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const handleSaveCartToOrder = async () => {
    const orderData = await saveCartToOrder();
    return orderData; // Returns the payment URL
  };

  const fetchOrders = async () => {
    const orderData = await viewOrders();
    setOrders(orderData.orders);
  };

  return (
    <OrderContext.Provider
      value={{ orders, handleSaveCartToOrder, fetchOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
};
