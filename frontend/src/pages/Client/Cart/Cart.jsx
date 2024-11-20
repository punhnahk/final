import { message, Popconfirm } from "antd";
import React from "react";
import { FaMinus, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";
import {
  deleteCartProduct,
  getMyCarts,
  selectCart,
  updateQuantity,
} from "../../../store/cartSlice";
import formatPrice from "../../../utils/formatPrice";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart) || { products: [], totalPrice: 0 };

  const isCartEmpty = !cart?.products.length;

  const onQuantityUpdate = async (productId, quantity) => {
    try {
      await dispatch(updateQuantity({ productId, quantity })).unwrap();
      dispatch(getMyCarts());
    } catch (error) {
      message.error("Failed to update quantity");
    }
  };

  const onDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteCartProduct(productId)).unwrap();
      message.success("Product removed successfully");
      dispatch(getMyCarts());
    } catch (error) {
      message.error("Failed to remove product");
    }
  };

  const shippingCost = cart && cart.totalPrice < 5000000 ? 20000 : 0;
  const totalPrice = (cart ? cart.totalPrice : 0) + shippingCost;

  return (
    <div className="bg-white">
      <WrapperContent className="py-4">
        {isCartEmpty && (
          <div className="rounded-2xl p-6 bg-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-[#090d14] font-medium text-3xl mb-2">
                Your cart is currently empty
              </p>
              <p className="text-sm text-[#6b7280]">
                Shop thousands of products at Noel Techshop now!
              </p>

              <Link
                to={ROUTE_PATH.PRODUCTS_LIST}
                className="inline-block px-4 py-[10px] rounded-3xl bg-[#d42424] text-white font-medium mt-3"
              >
                Shop Now
              </Link>
            </div>

            <img
              src="/images/empty_cart.png"
              alt="Cart"
              className="w-full sm:w-1/2 object-contain"
            />
          </div>
        )}

        {!isCartEmpty && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-8">
                {cart.products.map((it) => {
                  const salePrice = it.product.salePrice;
                  const originPrice = it.product.price;
                  const price = salePrice > 0 ? salePrice : originPrice;
                  const totalPrice = price * it.quantity;

                  return (
                    <div
                      key={`cart-product-item-${it._id}`}
                      className="bg-gray-200 rounded-xl px-4 py-3 mb-3 flex items-center justify-between flex-wrap"
                    >
                      <div className="flex gap-x-2 items-center text-wrap">
                        <div className="w-[68px] h-[68px] p-2 border border-white bg-white rounded-lg">
                          <img
                            src={it.product.image[0]}
                            alt="Product"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        <p className="font-medium pl-3 text-[#090d14] truncate max-w-[300px] sm:max-w-[250px] md:max-w-[250px] pr-5">
                          {it.product.name}
                        </p>
                      </div>

                      <div className="flex flex-grow justify-between items-center pt-2">
                        {/* Price Section */}
                        <div className="flex flex-col items-start w-[150px] sm:w-[200px]">
                          <p className="text-sm text-[#dc2626] font-semibold truncate">
                            {formatPrice(totalPrice)}
                          </p>

                          {salePrice > 0 && (
                            <p className="text-xs text-[#9ca3af] font-medium line-through">
                              {formatPrice(originPrice * it.quantity)}
                            </p>
                          )}
                        </div>

                        {/* Quantity and actions section */}
                        <div className="flex items-center gap-x-1 justify-center">
                          <button
                            onClick={() => {
                              if (it.quantity > 1) {
                                onQuantityUpdate(
                                  it.product._id,
                                  it.quantity - 1
                                );
                              } else {
                                onDeleteProduct(it.product._id); // Function to remove the product
                              }
                            }}
                            disabled={it.quantity <= 1}
                            className="p-2 bg-white rounded-full hover:bg-red-200 disabled"
                          >
                            <FaMinus className="text-[#6b7280]" />
                          </button>

                          <div className="flex items-center justify-center w-[45px]">
                            <div className="text-lg font-semibold text-center">
                              {it.quantity}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              onQuantityUpdate(it.product._id, it.quantity + 1)
                            }
                            className="p-2 bg-white rounded-full hover:bg-blue-200"
                          >
                            <FaPlus className="text-[#6b7280]" />
                          </button>

                          <Popconfirm
                            title="Remove product from cart"
                            description="Are you sure you want to remove this product?"
                            onConfirm={() => onDeleteProduct(it.product._id)}
                          >
                            <FaRegTrashAlt className="text-[#6b7280] cursor-pointer w-[24px] h-[24px] pl-2" />
                          </Popconfirm>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-span-12 sm:col-span-4 bg-gray-200 rounded-[10px] p-4 self-start">
                <p className="text-[#090d14] font-semibold mb-3">
                  Order Summary
                </p>

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs">Total</p>
                  <p className="font-medium">{formatPrice(cart.totalPrice)}</p>
                </div>

                <hr className="my-2 border-t-2 border-[#dc2626]" />

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs">Shipping</p>
                  <p className="font-medium">
                    {formatPrice(shippingCost)}
                  </p>{" "}
                </div>

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold">
                    Total (including shipping)
                  </p>
                  <p className="font-medium">{formatPrice(totalPrice)}</p>{" "}
                </div>

                <Link
                  to={ROUTE_PATH.CHECKOUT}
                  className="bg-[#dc2626] rounded-lg h-14 font-medium flex items-center justify-center mt-4 text-white"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </WrapperContent>
    </div>
  );
};

export default Cart;
