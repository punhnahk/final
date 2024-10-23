import { Form, Input, message, Radio, Select, Spin } from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import orderApi from "../../../api/orderApi";
import userApi from "../../../api/userApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { PAYMENT_METHOD } from "../../../constants";
import { PHONE_REG } from "../../../constants/reg";
import { ROUTE_PATH } from "../../../constants/routes";
import { resetCart, selectCart } from "../../../store/cartSlice";
import formatPrice from "../../../utils/formatPrice";

const { Option } = Select;

const Checkout = () => {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const FREE_SHIPPING_THRESHOLD = 5000000;
  const SHIPPING_FEE = 20000;

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("https://provinces.open-api.vn/api/p/");
        setCities(res.data);
      } catch (error) {
        message.error("Failed to fetch cities.");
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await userApi.getProfile();
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

    fetchCities();
    fetchUserInfo();
  }, [form]);

  const handleCityChange = async (cityCode) => {
    const selectedCity = cities.find((city) => city.code === cityCode);
    setSelectedCity(selectedCity);
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      );
      setDistricts(res.data.districts || []);
      form.setFieldsValue({ district: undefined }); // Reset district
    } catch (error) {
      message.error("Failed to fetch districts.");
    }
  };

  const onSubmit = async (values) => {
    const cityName = selectedCity ? selectedCity.name : values.city; // Get the selected city name
    const fullAddress = `${values.detailedAddress}, ${values.district}, ${cityName}`;
    try {
      await userApi.updateProfile({
        name: values.customerName,
        phone: values.customerPhone,
        email: values.customerEmail,
        address: fullAddress,
      });

      const res = await orderApi.createOrder({
        ...values,
        address: fullAddress,
      });
      const paymentMethod = res.data.paymentMethod;

      if (paymentMethod === PAYMENT_METHOD.COD) {
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

  const totalDiscount = cart.products.reduce((total, it) => {
    const salePrice = it.product.salePrice;
    const originPrice = it.product.price;

    if (salePrice > 0) {
      return total + (originPrice - salePrice) * it.quantity;
    }
    return total;
  }, 0);

  const totalPriceWithoutShipping = cart.totalPrice;
  const shippingCost =
    totalPriceWithoutShipping < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const totalPrice = totalPriceWithoutShipping + shippingCost;

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

                <FormItem
                  name="city"
                  rules={[{ required: true, message: "Please select a city" }]}
                >
                  <Select placeholder="Select City" onChange={handleCityChange}>
                    {cities.map((city) => (
                      <Option key={city.code} value={city.code}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>

                <FormItem
                  name="district"
                  rules={[
                    { required: true, message: "Please select a district" },
                  ]}
                >
                  <Select placeholder="Select District">
                    {districts.map((district) => (
                      <Option key={district.code} value={district.name}>
                        {" "}
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </FormItem>

                <FormItem
                  name="detailedAddress"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your detailed address",
                    },
                  ]}
                >
                  <Input placeholder="Street Address" />
                </FormItem>

                <FormItem className="mb-6" name="message">
                  <TextArea
                    placeholder="Note (e.g. Call me when the order is ready)"
                    rows={4}
                  />
                </FormItem>
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

              <div className="border-t pt-2 flex justify-between items-center">
                <p className="text-sm text-[#6b7280]">Total</p>
                <p className="text-xl text-[#dc2626] font-bold">
                  {formatPrice(totalPrice)}
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
