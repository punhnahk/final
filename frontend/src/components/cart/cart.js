import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext.js";

const Cart = () => {
  const { cart, loading, handleRemoveFromCart, handleUpdateCartProduct } =
    useContext(CartContext);

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-4">
              <div>
                <h3>{item.product.productName}</h3>
                <p>Price: ${item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div>
                <button
                  className="bg-red-500 text-white px-4 py-2"
                  onClick={() => handleRemoveFromCart(item.product._id)}
                >
                  Remove
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateCartProduct(item.product._id, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
