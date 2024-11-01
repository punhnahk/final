import { CommentOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, message, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import commentApi from "../../../api/commentApi";
import orderApi from "../../../api/orderApi";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../../../constants";
import formatPrice from "../../../utils/formatPrice";
import { getOrderPaymentStatus, getOrderStatus } from "../../../utils/order";

const ConfirmPopup = ({ children, onConfirm }) => {
  return (
    <Popconfirm
      title="Update Order Status"
      description="Confirm to update the order status?"
      onConfirm={onConfirm}
    >
      <span>{children}</span>
    </Popconfirm>
  );
};

const OrderDetail = () => {
  const [data, setData] = useState();
  const [comments, setComments] = useState([]); // State for comments

  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    if (orderId) {
      fetchData(orderId);
      fetchComments(orderId); // Fetch comments for the order
    }
  }, [orderId]);

  const fetchData = async (orderId) => {
    try {
      const { data } = await orderApi.getOrder(orderId);
      setData(data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const fetchComments = async (orderId) => {
    try {
      const { data } = await commentApi.getCommentsByOrderId(orderId); // Adjust your API call
      setComments(data); // Set comments in state
    } catch (error) {
      message.error("Failed to fetch comments");
    }
  };

  const handleDeleteComment = (commentId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await commentApi.deleteComment(commentId);
          message.success("Comment deleted successfully.");
          fetchComments(orderId);
        } catch (error) {
          message.error("Failed to delete comment. Please try again.");
          console.error(error); // Log the error for debugging
        }
      },
      onCancel() {
        // Optional: You can handle cancellation here if needed
      },
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt",
      render: (_, __, index) => ++index,
    },
    {
      title: "Product Name",
      key: "product",
      dataIndex: "product",
      render: (product) => product.name,
    },
    {
      title: "Unit Price",
      key: "product",
      dataIndex: "product",
      render: (product) => {
        const productPrice =
          product.salePrice > 0 ? product.salePrice : product.price;

        return formatPrice(productPrice);
      },
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Discount",
      key: "discount",
      render: () => {
        return formatPrice(data?.discountAmount || 0);
      },
    },
    {
      title: "Total Price",
      key: "product",
      dataIndex: "product",
      render: (product, row) => {
        const productPrice =
          product.salePrice > 0 ? product.salePrice : product.price;

        return formatPrice(
          productPrice * row.quantity - (data?.discountAmount || 0)
        );
      },
    },
  ];

  const updateOrderStatus = async ({ status, paymentStatus }) => {
    try {
      const payload = {};
      status && (payload.status = status);
      paymentStatus && (payload.paymentStatus = paymentStatus);

      await orderApi.updateStatus({ id: orderId, ...payload });
      message.success("Successfully updated order status");
      fetchData(orderId);
    } catch (error) {
      message.error("Failed to update");
    }
  };

  const renderActButton = () => {
    if (!data) return;

    switch (data.status) {
      case ORDER_STATUS.INITIAL: {
        return (
          <div className="flex gap-2">
            <ConfirmPopup
              onConfirm={() =>
                updateOrderStatus({ status: ORDER_STATUS.CANCELED })
              }
            >
              <Button danger>Cancel Order</Button>
            </ConfirmPopup>

            {data.paymentMethod === PAYMENT_METHOD.COD && (
              <ConfirmPopup
                onConfirm={() =>
                  updateOrderStatus({ status: ORDER_STATUS.CONFIRMED })
                }
              >
                <Button type="primary">Confirm Order</Button>
              </ConfirmPopup>
            )}
          </div>
        );
      }

      case ORDER_STATUS.CONFIRMED: {
        if (
          data.paymentMethod === PAYMENT_METHOD.COD ||
          (data.paymentMethod === PAYMENT_METHOD.VNPAY &&
            data.paymentStatus === PAYMENT_STATUS.PAID)
        ) {
          return (
            <ConfirmPopup
              onConfirm={() =>
                updateOrderStatus({ status: ORDER_STATUS.DELIVERING })
              }
            >
              <Button type="primary">Delivering</Button>
            </ConfirmPopup>
          );
        }

        return "";
      }

      case ORDER_STATUS.DELIVERING: {
        return (
          <ConfirmPopup
            onConfirm={() =>
              updateOrderStatus({
                status: ORDER_STATUS.DELIVERED,
                paymentStatus: PAYMENT_STATUS.PAID,
              })
            }
          >
            <Button type="primary">Delivery Successful</Button>
          </ConfirmPopup>
        );
      }
      default:
        return "";
    }
  };
  const groupedComments = comments.reduce((acc, comment) => {
    (acc[comment.productId] = acc[comment.productId] || []).push(comment);
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-semibold text-2xl">Order Details #{orderId}</h1>

        {renderActButton()}
      </div>

      <Card>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Recipient Information
            </h3>
            <p className="text-base leading-8 text-blue-600">
              Recipient Name: {data?.customerName}
            </p>
            <p className="text-base leading-7 text-gray-700">
              Email: {data?.customerEmail}
            </p>
            <p className="text-base leading-7 text-green-600">
              Phone Number: {data?.customerPhone}
            </p>
            <p className="text-base leading-7 text-gray-800">
              Address: {data?.address}
            </p>
            <p className="text-base leading-7 text-yellow-600">
              Notes: {data?.message}
            </p>
          </div>

          <div className="col-span-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Order Details
            </h3>
            <p className="text-base leading-8 text-purple-600">
              Payment Method:{" "}
              {data?.paymentMethod === PAYMENT_METHOD.COD
                ? "Cash on Delivery"
                : "VNPay"}
            </p>
            <p className="text-base leading-7 text-orange-600">
              Order Status: {getOrderStatus(data?.status)}
            </p>
            <p className="text-base leading-7 text-red-600">
              Payment Status: {getOrderPaymentStatus(data?.paymentStatus)}
            </p>
            <p className="text-base leading-7 text-gray-700">
              Voucher: {data?.voucherCode}
            </p>
            <p className="text-base leading-7 text-blue-500 font-semibold">
              Delivery Time:{" "}
              {data?.updatedAt
                ? new Date(data.updatedAt).toLocaleString("vi")
                : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      <h2 className="font-semibold text-2xl mb-3 mt-6">Products</h2>

      <Table
        columns={columns}
        dataSource={data?.products}
        rowKey="_id"
        scroll={{ x: 900 }}
        pagination={false}
      />

      <p className="text-2xl mt-4 text-center font-semibold">
        Total Amount: {formatPrice(data?.totalPrice)}
      </p>
      <h2 className="font-semibold text-2xl mb-3 mt-6">Comments</h2>
      {Object.keys(groupedComments).length === 0 ? (
        <div className="flex items-center text-gray-500 italic">
          <CommentOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
          <span>No comments</span>
        </div>
      ) : (
        Object.keys(groupedComments).map((productId) => (
          <div key={productId}>
            <h3 className="font-semibold text-lg">
              Comments for Product ID: {productId}
            </h3>
            {groupedComments[productId].map((comment) => (
              <div
                key={comment._id}
                className="border border-gray-300 p-4 mb-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {comment.userId.name}:
                  </p>
                  <div className="flex items-center mb-1">
                    {Array.from({ length: 5 }, (_, starIndex) => {
                      if (starIndex < Math.floor(comment.rating)) {
                        return (
                          <span
                            key={starIndex}
                            className="text-xl text-yellow-500"
                          >
                            ★
                          </span>
                        ); // Full star
                      } else if (
                        starIndex === Math.floor(comment.rating) &&
                        comment.rating % 1 !== 0
                      ) {
                        return (
                          <span
                            key={starIndex}
                            className="text-xl text-yellow-500"
                          >
                            ☆{" "}
                            {/* Half star can be represented as an empty star icon */}
                          </span>
                        ); // Half star
                      } else {
                        return (
                          <span
                            key={starIndex}
                            className="text-xl text-gray-300"
                          >
                            ★
                          </span>
                        ); // Empty star
                      }
                    })}
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Commented on: {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <Popconfirm
                  title="Are you sure you want to delete this comment?"
                  onConfirm={() => handleDeleteComment(comment._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined
                    className="text-red-500 cursor-pointer"
                    style={{ fontSize: "24px" }}
                  />
                </Popconfirm>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
};

export default OrderDetail;
