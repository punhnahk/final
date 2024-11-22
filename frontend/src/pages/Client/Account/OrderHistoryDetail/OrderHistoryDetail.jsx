import { Button, message, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import orderApi from "../../../../api/orderApi";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../../constants";
import { ROUTE_PATH } from "../../../../constants/routes";
import formatPrice from "../../../../utils/formatPrice";
import { getOrderStatus } from "../../../../utils/order";

const OrderHistoryDetail = () => {
  const [data, setData] = useState();
  const { id } = useParams();

  useEffect(() => {
    id && fetchData(id);
  }, [id]);

  const fetchData = async (id) => {
    try {
      const res = await orderApi.getOrder(id);
      setData(res.data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const handleCancelOrder = async () => {
    try {
      await orderApi.updateStatus({ id, status: ORDER_STATUS.CANCELED });
      message.success("Order cancelled successfully");
      fetchData(id);
    } catch (error) {
      message.error("Failed to update");
    }
  };

  if (!data) return;

  return (
    <>
      <div className="px-6 py-4 flex items-center justify-between gap-x-8 flex-wrap">
        <p className="text-[24px] font-semibold text-[#333]">
          <p>Order details #{data._id}</p>
        </p>

        <p className="text-[#111] whitespace-nowrap">
          Placed at: {dayjs(data.createdAt).format("HH:mm dddd, DD.MM.YYYY")}
        </p>
      </div>

      <div className="px-6 flex items-center justify-between">
        <p className="text-[#FF7A00] text-[24px] font-semibold">
          {getOrderStatus(data.status)}
        </p>

        {data.status === ORDER_STATUS.INITIAL && (
          <Popconfirm
            title="Cancel order"
            description="Are you sure you want to cancel this order?"
            onConfirm={handleCancelOrder}
          >
            <Button danger type="primary">
              Cancel Order
            </Button>
          </Popconfirm>
        )}
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 rounded border border-[#CFCFCF] pt-3 px-4 pb-4">
            <div className="flex items-center gap-x-3 mb-3">
              <img src="/svg/customer-info.svg" alt="Icon" className="h-7" />
              <p className="text-[#333] font-semibold">Customer Information</p>
            </div>

            <div className="flex items-center mb-3 gap-x-3">
              <p className="w-1/3">Recipient:</p>
              <p className="flex-1">
                {data.customerName} - {data.customerPhone}
              </p>
            </div>

            <div className="flex items-center mb-3 gap-x-3">
              <p className="w-1/3">Shipping Address:</p>
              <p className="flex-1">{data.address}</p>
            </div>

            {data.status === ORDER_STATUS.DELIVERED && (
              <div className="flex items-center mb-3 gap-x-3">
                <p className="w-1/3">Delivery Time:</p>
                <p className="flex-1">
                  {dayjs(data.updatedAt).format("HH:mm DD.MM.YYYY")}
                </p>
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-4 pt-3 px-4 pb-4 border border-[#CFCFCF] rounded">
            <div className="flex items-center gap-x-3 mb-3">
              <img src="/svg/payment-method.svg" alt="Icon" className="h-7" />
              <p className="text-[#333] font-semibold">Payment Method</p>
            </div>

            <p className="text-[#ff7300]">
              {data.paymentMethod} -{" "}
              {data.paymentStatus === PAYMENT_STATUS.PAID ? "Paid" : "Unpaid"}
            </p>
          </div>
        </div>

        <div className="pt-3 px-4 pb-4 mt-4 border border-[#CFCFCF] rounded">
          <div className="flex items-center gap-x-3 mb-3">
            <img src="/svg/product-info.svg" alt="Icon" className="h-7" />
            <p className="text-[#333] font-semibold">Product Information</p>
          </div>

          {data.products.map((it) => {
            const totalPrice = it.product.salePrice
              ? it.product.salePrice * it.quantity
              : it.product.price * it.quantity;

            return (
              <div
                className="p-2 flex gap-x-4"
                key={`order-product-item-${it._id}`}
              >
                <div className="w-3/4 flex gap-x-3 items-center">
                  <img
                    src={it.product.image[0]}
                    alt="Product img"
                    className="w-[60px] h-[60px] object-cover"
                  />

                  <div>
                    <p className="text-[#111]">{it.product.name}</p>
                    <p className="text-[14px] text-[#535353] mt-1">
                      Quantity: {it.quantity}
                    </p>
                  </div>
                </div>

                <div className="w-1/4">
                  <p className="text-[#e30019] text-right break-words">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:ml-[50%] mt-4">
          <div className="flex items-center mb-3">
            <p className="w-1/2">Total Discount</p>
            <p className="w-1/2 text-right text-red-500">
              - {formatPrice(data.discountAmount)}
            </p>
          </div>
          <div className="flex items-center mb-3">
            <p className="w-1/2">Shipping Fee:</p>
            <p className="w-1/2 text-right">Free</p>
          </div>

          <div className="flex items-center mb-3">
            <p className="w-1/2">Total:</p>
            <p className="w-1/2 text-right">{formatPrice(data.totalPrice)}</p>
          </div>

          <div className="flex items-center mb-3">
            <p className="w-1/2 flex items-center gap-x-1">
              <FaCheckCircle className="text-[14px] text-[#24b400]" />
              <span>Paid Amount:</span>
            </p>
            <p className="w-1/2 text-right font-bold text-[#e30019]">
              {formatPrice(
                data.paymentStatus === PAYMENT_STATUS.PAID ? data.totalPrice : 0
              )}
            </p>
          </div>
        </div>

        <div className="my-12 text-center">
          <Link
            to={ROUTE_PATH.ORDERS_HISTORY}
            className="inline-flex items-center px-6 text-white bg-[#1982f9] rounded h-[50px]"
          >
            Back to Order List
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderHistoryDetail;
