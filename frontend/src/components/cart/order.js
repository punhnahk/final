import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";

const Checkout = () => {
  const { handleSaveCartToOrder } = useContext(OrderContext);
  const { cart } = useContext(CartContext);

  const proceedToPayment = async () => {
    const orderData = await handleSaveCartToOrder();
    window.location.href = orderData.paymentUrl; // Redirect to VNPay payment URL
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <button
          className="bg-green-500 text-white px-6 py-2"
          onClick={proceedToPayment}
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

export default Checkout;
