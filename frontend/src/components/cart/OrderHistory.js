import React, { useContext, useEffect } from "react";
import { OrderContext } from "../context/OrderContext";

const OrderHistory = () => {
  const { orders, fetchOrders } = useContext(OrderContext);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4">
            <h3>Order #{order._id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <div>
              {order.products.map((item) => (
                <div key={item.product._id}>
                  <p>
                    {item.product.productName} - Quantity: {item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
