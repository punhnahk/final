import { Breadcrumb, InputNumber, message, Popconfirm } from "antd";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
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
  const cart = useSelector(selectCart);

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

  return (
    <div className="bg-gray-100">
      <WrapperContent className="py-4">
        {isCartEmpty && (
          <div className="rounded-2xl p-6 bg-white flex items-center justify-between">
            <div>
              <p className="text-[#090d14] font-medium text-3xl mb-2">
                Your cart is currently empty
              </p>
              <p className="text-sm text-[#6b7280]">
                Shop thousands of products at FPTShop now!
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
              className="w-1/2 object-contain"
            />
          </div>
        )}

        {!isCartEmpty && (
          <>
            <Breadcrumb
              className="mb-3"
              items={[
                {
                  title: (
                    <Link
                      className="!text-[#1250dc] font-medium"
                      to={ROUTE_PATH.HOME}
                    >
                      Home
                    </Link>
                  ),
                },
                {
                  title: "Shopping Cart",
                  className: "font-medium",
                },
              ]}
            />

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8">
                {cart.products.map((it) => {
                  const salePrice = it.product.salePrice;
                  const originPrice = it.product.price;

                  const price = salePrice > 0 ? salePrice : originPrice;
                  const totalPrice = price * it.quantity;

                  return (
                    <div
                      key={`cart-product-item-${it._id}`}
                      className="bg-white rounded-xl px-4 py-3 mb-3 flex items-center justify-between"
                    >
                      <div className="flex gap-x-2 items-center">
                        <div className="w-[68px] h-[68px] p-2 border border-[#d1d5db] rounded-lg">
                          <img
                            src={it.product.image[0]}
                            alt="Product"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        <p className="font-medium text-[#090d14]">
                          {it.product.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-x-6">
                        <div>
                          <p className="text-sm text-[#dc2626] font-semibold">
                            {formatPrice(totalPrice)}
                          </p>

                          {salePrice > 0 && (
                            <p className="text-xs text-[#9ca3af] font-medium line-through">
                              {formatPrice(originPrice * it.quantity)}
                            </p>
                          )}
                        </div>

                        <InputNumber
                          value={it.quantity}
                          size="large"
                          onKeyDown={(e) => e.preventDefault()}
                          min={1}
                          onChange={(val) =>
                            onQuantityUpdate(it.product._id, val)
                          }
                        />

                        <Popconfirm
                          title="Remove product from cart"
                          description="Are you sure you want to remove this product?"
                          onConfirm={() => onDeleteProduct(it.product._id)}
                        >
                          <FaRegTrashAlt className="text-[#6b7280] cursor-pointer" />
                        </Popconfirm>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-span-4 bg-white rounded-[10px] p-4 self-start">
                <p className="text-[#090d14] font-semibold mb-3">
                  Order Summary
                </p>

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs">Total</p>

                  <p className="font-medium">{formatPrice(cart.totalPrice)}</p>
                </div>

                <hr className="my-2" />

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs">Total Discounts</p>

                  <p className="font-medium">{formatPrice(0)}</p>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs">Shipping</p>

                  <p className="font-medium text-xs">Free</p>
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
