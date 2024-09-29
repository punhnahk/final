import React, { createContext, useEffect, useState } from "react";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartProduct,
} from "../api/cartAPI"; // API functions for cart

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getCart();
      setCart(cartData.products);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handleAddToCart = async (productId, quantity) => {
    const updatedCart = await addToCart(productId, quantity);
    setCart(updatedCart.products);
  };

  const handleRemoveFromCart = async (productId) => {
    const updatedCart = await removeFromCart(productId);
    setCart(updatedCart.products);
  };

  const handleUpdateCartProduct = async (productId, quantity) => {
    const updatedCart = await updateCartProduct(productId, quantity);
    setCart(updatedCart.products);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateCartProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
