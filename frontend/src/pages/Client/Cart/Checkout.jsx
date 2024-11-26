import { AutoComplete, Form, Input, message, Radio, Spin } from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import orderApi from "../../../api/orderApi";
import userApi from "../../../api/userApi";
import voucherApi from "../../../api/voucherApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { PAYMENT_METHOD } from "../../../constants";
import { PHONE_REG } from "../../../constants/reg";
import { ROUTE_PATH } from "../../../constants/routes";
import useProfile from "../../../hooks/useProfile";
import { resetCart, selectCart } from "../../../store/cartSlice";
import formatPrice from "../../../utils/formatPrice";

const Checkout = () => {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [voucherCode, setVoucherCode] = useState("");
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [savedAddress, setSavedAddress] = useState(null);
  const [addressOptions, setAddressOptions] = useState([]);

  const FREE_SHIPPING_THRESHOLD = 5000000;
  const SHIPPING_FEE = 20000;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await userApi.getProfile();
        const userData = res.data;
        setSavedAddress(userData.address);
        form.setFieldsValue({
          customerName: res.data.name,
          customerPhone: res.data.phone,
          customerEmail: res.data.email,
          address: res.data.address,
        });
      } catch (error) {
        message.error("Failed to fetch user information.");
      }
    };

    fetchUserInfo();
  }, [form]);

  const handleAddressSearch = async (searchText) => {
    if (!searchText) return;
    try {
      // Fetch address suggestions from Goong API
      const response = await axios.get(
        "https://rsapi.goong.io/Place/AutoComplete",
        {
          params: {
            api_key: process.env.REACT_APP_GOONG_API_KEY,
            input: searchText,
          },
        }
      );

      // Map the response to format suitable for AutoComplete
      const options = response.data.predictions.map((prediction) => ({
        value: prediction.description,
      }));

      setAddressOptions(options);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleAddressSelect = (value) => {
    form.setFieldsValue({ address: value });
  };

  const handleAddressChange = (e) => {
    setUseSavedAddress(e.target.value === "saved");
  };

  const onSubmit = async (values) => {
    if (!addressOptions) {
      message.error("Please enter a valid address.");
      setUseSavedAddress(false);
      return;
    }

    try {
      if (!useSavedAddress) {
        await userApi.updateProfile({
          name: values.customerName,
          phone: values.customerPhone,
          email: values.customerEmail,
          address: values.address,
        });
      }

      const res = await orderApi.createOrder({
        ...values,
        address: values.address,
        voucherCode,
      });

      if (res.data.paymentMethod === PAYMENT_METHOD.COD) {
        dispatch(resetCart());
        navigate(ROUTE_PATH.ORDER_SUCCESS);
      } else {
        window.location.href = res.data.paymentUrl;
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  if (!cart) {
    return (
      <WrapperContent className="h-[300px] flex items-center justify-center">
        <Spin />
      </WrapperContent>
    );
  }
  const applyVoucher = async () => {
    if (isVoucherApplied) {
      message.warning("A voucher is already applied.");
      return;
    }

    try {
      const userId = useProfile;
      const response = await voucherApi.getVoucherByCode(voucherCode, userId);
      const voucher = response.data;

      if (
        voucher &&
        voucher.isActive &&
        new Date(voucher.expirationDate) > new Date()
      ) {
        const discount =
          (totalPriceWithoutShipping * voucher.discountPercentage) / 100;
        setTotalDiscount(discount);
        setIsVoucherApplied(true);
        message.success("Coupon applied successfully!");
      } else {
        message.error("Invalid or expired Coupon code.");
        setTotalDiscount(0);
      }
    } catch (error) {
      console.error("Error applying Coupon:", error);
      if (error.response && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error("An unexpected error occurred.");
      }
    }
  };

  const totalPriceWithoutShipping = cart.totalPrice - totalDiscount;
  const shippingCost =
    totalPriceWithoutShipping < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const total = totalPriceWithoutShipping + shippingCost;

  const clearVoucherCode = () => {
    setVoucherCode(""); // Clear the voucher code state
    setTotalDiscount(0);
    setIsVoucherApplied(false); // Reset voucher applied state
  };
  return (
    <div className="bg-gray-100">
      <WrapperContent className="py-4">
        <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
          <div className="flex items-center gap-1.5">
            <FaAngleLeft className="text-[#1250dc]" />
            <p className="text-sm font-semibold text-[#1250dc]">Back to cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div className="bg-white rounded-xl p-4 mb-3">
              <p className="text-[#090d14] font-semibold">
                Products in Order ({cart.products.length})
              </p>
              <div className="mt-1">
                {cart.products.map((it) => {
                  const salePrice = it.product.salePrice;
                  const originPrice = it.product.price;
                  const price = salePrice > 0 ? salePrice : originPrice;
                  const totalPrice = price * it.quantity;

                  return (
                    <div
                      key={`cart-product-item-${it._id}`}
                      className="flex items-center py-3 justify-between [&:not(:last-child)]:border-b"
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
                      <div className="text-right">
                        <p className="text-[#dc2626] font-semibold">
                          {formatPrice(totalPrice)}
                        </p>
                        {salePrice > 0 && (
                          <p className="text-sm text-[#9ca3af] font-medium line-through">
                            {formatPrice(originPrice * it.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Form
              onFinish={onSubmit}
              size="large"
              form={form}
              initialValues={{ paymentMethod: PAYMENT_METHOD.COD }}
            >
              <div className="bg-white rounded-xl p-4 mb-3">
                <p className="text-[#090d14] font-semibold mb-4">
                  Customer Information
                </p>

                <FormItem
                  className="mb-6"
                  name="customerName"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="Full Name" />
                </FormItem>

                <FormItem
                  className="mb-6"
                  name="customerPhone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                    {
                      pattern: PHONE_REG,
                      message: "Invalid phone number format",
                    },
                  ]}
                >
                  <Input placeholder="Phone Number" />
                </FormItem>

                <FormItem
                  className="mb-6"
                  name="customerEmail"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Invalid email format" },
                  ]}
                >
                  <Input placeholder="Email" />
                </FormItem>
              </div>

              <div className="bg-white rounded-xl p-4 mb-3">
                <p className="text-[#090d14] font-semibold mb-4">
                  Shipping Information
                </p>

                <FormItem name="addressType" className="mb-4">
                  <Radio.Group
                    onChange={handleAddressChange}
                    value={useSavedAddress ? "saved" : "new"}
                  >
                    <Radio value="saved">Use saved address</Radio>
                    <Radio value="new">Enter a new address</Radio>
                  </Radio.Group>
                </FormItem>

                {useSavedAddress ? (
                  <div>
                    <FormItem name="address">
                      <Input placeholder="Saved Address" disabled />
                    </FormItem>
                  </div>
                ) : (
                  <div>
                    <FormItem
                      name="address"
                      className="mb-6"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your address",
                        },
                      ]}
                    >
                      <AutoComplete
                        options={addressOptions}
                        onSearch={handleAddressSearch}
                        onSelect={handleAddressSelect}
                        placeholder="Search for your address"
                        className="rounded w-full"
                      >
                        <Input />
                      </AutoComplete>
                    </FormItem>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 mb-3">
                <p className="text-[#090d14] font-semibold mb-4">
                  Payment Method
                </p>
                <FormItem className="mb-0" name="paymentMethod">
                  <Radio.Group>
                    <Radio className="block" value={PAYMENT_METHOD.COD}>
                      Cash on Delivery
                    </Radio>
                    <Radio className="block" value={PAYMENT_METHOD.VNPAY}>
                      Pay via ATM (VNPay)
                    </Radio>
                  </Radio.Group>
                </FormItem>
              </div>
            </Form>
          </div>

          <div className="md:col-span-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-[#090d14] font-semibold mb-3">Order Summary</p>

              <div className="mb-2 flex justify-between items-center">
                <p className="text-sm text-[#6b7280]">Total Products</p>
                <p className="text-sm text-[#090d14] font-semibold">
                  {formatPrice(totalPriceWithoutShipping)}
                </p>
              </div>

              {totalDiscount > 0 && (
                <div className="mb-2 flex justify-between items-center">
                  <p className="text-sm text-[#6b7280]">Discount</p>
                  <p className="text-sm text-[#dc2626] font-semibold">
                    -{formatPrice(totalDiscount)}
                  </p>
                </div>
              )}

              <div className="mb-2 flex justify-between items-center">
                <p className="text-sm text-[#6b7280]">Shipping Fee</p>
                <p className="text-sm text-[#090d14] font-semibold">
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </p>
              </div>
              {/* Section for Voucher Code */}
              <p className="text-[#090d14] font-semibold mb-3">Apply Coupon</p>
              <FormItem>
                <div className="relative">
                  <Input
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    style={{
                      width: "70%",
                      marginRight: "10px",
                      paddingRight: "30px",
                    }}
                  />
                  {voucherCode && (
                    <button
                      onClick={clearVoucherCode}
                      className="absolute right-28 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        color: "gray",
                      }}
                    >
                      <FaTimes style={{ fontSize: "18px" }} />
                    </button>
                  )}
                  <button
                    onClick={applyVoucher}
                    disabled={!voucherCode}
                    className={`bg-blue-500 text-white py-2 px-4 rounded ${
                      !voucherCode ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Apply
                  </button>
                </div>
              </FormItem>

              <div className="border-t pt-2 flex justify-between items-center">
                <p className="text-sm text-[#6b7280]">Total</p>
                <p className="text-xl text-[#dc2626] font-bold">
                  {formatPrice(total)}
                </p>
              </div>

              <div className="mt-4">
                <button
                  className="w-full bg-[#1250dc] text-white py-2 rounded-lg font-semibold"
                  onClick={() => form.submit()}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </WrapperContent>
    </div>
  );
};

export default Checkout;
