import { Button, Input, message, Rate } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import commentApi from "../../../../api/commentApi"; // Import your commentApi
import { ROUTE_PATH } from "../../../../constants/routes";
import useProfile from "../../../../hooks/useProfile";
import formatPrice from "../../../../utils/formatPrice";
import { getOrderStatus } from "../../../../utils/order";

const MAX_PRODUCT = 1;
const statusColors = {
  INITIAL: "text-blue-500",
  CONFIRMED: "text-green-500",
  DELIVERING: "text-yellow-500",
  DELIVERED: "text-purple-500",
  CANCELED: "text-red-500",
};

const OrderCard = ({ data }) => {
  const [showMore, setShowMore] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5); // Rating state for the product
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false); // State for toggling comment visibility
  const { profile } = useProfile();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentApi.getCommentsByOrderId(data._id);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [data._id]);

  const handleAddComment = async (productId, newComment, rating) => {
    if (!newComment) {
      message.warning("Comment cannot be empty.");
      return;
    }

    const hasCommented = comments.some(
      (c) => c.userId._id === profile._id && c.productId === productId
    );
    if (hasCommented) {
      message.warning("You have already commented on this product.");
      return;
    }

    setLoading(true);
    try {
      const commentData = {
        content: newComment,
        orderId: data._id,
        productId: productId,
        rating: rating,
      };

      await commentApi.addComment(commentData);
      message.success("Comment added successfully!");
      const updatedComments = await commentApi.getCommentsByOrderId(data._id);
      setComments(updatedComments.data);
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Error adding comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProducts = () => {
    setShowMore(!showMore);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };
  const handleCopyOrderId = (orderId) => {
    // Copy the order ID to the clipboard
    navigator.clipboard
      .writeText(orderId.slice(-5))
      .then(() => {
        message.success("Order ID copied to clipboard!");
      })
      .catch((err) => {
        message.error("Failed to copy order ID");
        console.error(err);
      });
  };

  return (
    <div className="pt-4 px-4 md:px-6 p-3 rounded bg-white mb-6 border-2 border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        {/* Order Status */}
        <p
          className={`w-full sm:w-auto text-sm md:text-[14px] font-semibold ${
            statusColors[data.status] || "text-gray-500"
          }`}
        >
          {getOrderStatus(data.status)}
        </p>

        {/* Order Info */}
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <p
            className="text-sm md:text-[14px] text-[#111] font-semibold cursor-pointer hover:underline break-words"
            onClick={() => handleCopyOrderId(data._id)}
          >
            #{data._id.slice(-5).toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="py-4 mb-4 border-b border-gray-200">
        {data.products
          .slice(0, showMore ? data.products.length : MAX_PRODUCT)
          .map((it) => {
            const salePrice = it.product.salePrice;
            const productPrice = it.product.price;
            const totalPriceSale = salePrice * it.quantity;
            const totalPriceBeforeSale = productPrice * it.quantity;

            return (
              <div
                className="flex flex-col md:flex-row items-start md:items-center mb-6"
                key={`order-product-item-${it.product._id}`}
              >
                <div className="p-2 w-full md:w-3/4 flex flex-wrap items-start gap-3">
                  <Link
                    to={ROUTE_PATH.PRODUCT_DETAIL(it.product._id)}
                    className="flex items-center w-full"
                  >
                    <div className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] border border-gray-300 rounded-lg overflow-hidden relative flex-shrink-0">
                      <img
                        src={it.product.image[0]}
                        loading="lazy"
                        alt="Product img"
                        className="block w-full h-full object-cover"
                      />
                      <p className="absolute bottom-0 right-0 w-6 h-6 bg-gray-200 text-xs md:text-sm text-[#6d6e72] font-semibold flex items-center justify-center rounded-tl-full">
                        x{it.quantity}
                      </p>
                    </div>
                    <div className="flex-1 ml-3 min-w-0">
                      <p className="text-sm md:text-base text-[#111] font-semibold truncate">
                        {it.product.name}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="w-full md:w-1/4 text-right text-[#111] mt-2 md:mt-0">
                  <p className="font-semibold">
                    {formatPrice(
                      salePrice ? totalPriceSale : totalPriceBeforeSale
                    )}
                  </p>
                  {salePrice > 0 && (
                    <p className="line-through text-sm text-gray-500">
                      {formatPrice(totalPriceBeforeSale)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {data.products.length > 1 && (
        <Button
          className="rounded w-full text-xs md:text-sm text-gray-600 hover:text-gray-800"
          onClick={handleToggleProducts}
        >
          {showMore
            ? "Show less products"
            : `View ${data.products.length - MAX_PRODUCT} more products`}
        </Button>
      )}

      <div className="text-right mt-4">
        <p className="text-sm md:text-base font-semibold">
          <span>Total: </span>
          <span className="text-[#e30019]">{formatPrice(data.totalPrice)}</span>
        </p>

        <Link
          to={ROUTE_PATH.ORDER_HISTORY_DETAIL(data._id)}
          className="border border-[#1982f9] rounded-md px-3 py-2 text-xs md:text-[14px] text-[#1982f9] inline-flex items-center mt-2"
        >
          View details
        </Link>
      </div>

      {data.status === "DELIVERED" && (
        <div className="flex flex-col gap-6 mt-4">
          <Button type="link" onClick={handleToggleComments}>
            {showComments ? "Show All Comments" : "Hide All Comments"}
          </Button>

          {showComments && (
            <div className="flex flex-col gap-6 mt-4">
              {data.products.map((product) => {
                const productComments = comments.filter(
                  (comment) => comment.productId === product.product._id
                );

                return (
                  <div
                    key={product.product._id}
                    className="flex flex-col gap-2"
                  >
                    <div className="bg-gray-100 p-3 rounded">
                      <h3 className="text-lg font-semibold">
                        Add a Comment for {product.product.name}
                      </h3>
                      {productComments.length > 0 ? (
                        <div>
                          <p className="text-sm">
                            {productComments[0].content}
                          </p>
                          <Rate value={productComments[0].rating} disabled />
                        </div>
                      ) : (
                        <div>
                          <Input.TextArea
                            rows={4}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts on this product..."
                            className="mb-2"
                          />
                          <div className="flex items-center gap-3">
                            <Rate
                              onChange={(value) => setRating(value)}
                              className="mb-2"
                            />
                            <Button
                              type="primary"
                              className="ml-auto"
                              loading={loading}
                              onClick={() =>
                                handleAddComment(
                                  product.product._id,
                                  comment,
                                  rating
                                )
                              }
                            >
                              Add Comment
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrderHistory = ({ data }) => {
  return (
    <div className="flex flex-col space-y-5">
      {data.map((order) => (
        <OrderCard key={order._id} data={order} />
      ))}
    </div>
  );
};

export default OrderHistory;
