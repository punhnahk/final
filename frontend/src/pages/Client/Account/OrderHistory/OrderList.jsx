import { Button, Input, message, Rate } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import formatPrice from "../../../../utils/formatPrice";
import { getOrderStatus } from "../../../../utils/order";

const MAX_PRODUCT = 2;
const statusColors = {
  INITIAL: "text-blue-500",
  CONFIRMED: "text-green-500",
  DELIVERING: "text-yellow-500",
  DELIVERED: "text-purple-500",
  CANCELED: "text-red-500",
};

const OrderCard = ({ data, onCommentSubmit, hasCommentedMap }) => {
  const [showMore, setShowMore] = useState(false);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  const handleToggleProducts = () => {
    setShowMore(!showMore);
  };

  const handleCommentChange = (productId, e) => {
    setComments({
      ...comments,
      [productId]: e.target.value,
    });
  };

  const handleRatingChange = (productId, value) => {
    setRatings({
      ...ratings,
      [productId]: value,
    });
  };

  const handleCommentSubmit = async (productId) => {
    if (!comments[productId]) {
      message.error("Comment cannot be empty.");
      return;
    }

    if (hasCommentedMap[`${data._id}_${productId}`]) {
      message.error("You have already commented on this product.");
      return;
    }

    try {
      await onCommentSubmit(
        data._id,
        productId,
        comments[productId],
        ratings[productId]
      ); // Pass rating too
      setComments((prev) => ({
        ...prev,
        [productId]: "",
      }));
      setRatings((prev) => ({
        ...prev,
        [productId]: undefined,
      }));
    } catch {
      message.error("Failed to submit comment.");
    }
  };

  return (
    <div className="pt-4 px-4 md:px-6 pb-6 rounded bg-white shadow-sm hover:shadow-lg transition-all duration-300 mb-4">
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-gray-200">
        <p
          className={`text-sm md:text-[14px] font-semibold ${
            statusColors[data.status] || "text-gray-500"
          }`}
        >
          {getOrderStatus(data.status)}
        </p>
        <p className="text-sm md:text-[14px] text-[#111] font-semibold mt-2 md:mt-0">
          #{data._id}
        </p>
      </div>

      <div className="py-4 mb-3 border-b border-gray-200">
        {data.products
          .slice(0, showMore ? data.products.length : MAX_PRODUCT)
          .map((it) => {
            const salePrice = it.product.salePrice;
            const productPrice = it.product.price;
            const totalPriceSale = salePrice * it.quantity;
            const totalPriceBeforeSale = productPrice * it.quantity;

            return (
              <div
                className="flex flex-col md:flex-row items-start md:items-center mb-4"
                key={`order-product-item-${it._id}`}
              >
                <div className="p-2 w-full md:w-3/4 flex items-center gap-x-3">
                  <Link
                    to={ROUTE_PATH.PRODUCT_DETAIL(it.product._id)}
                    className="flex items-center w-full"
                  >
                    <div className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] border border-gray-300 rounded-lg overflow-hidden relative">
                      <img
                        src={it.product.image[0]}
                        alt="Product img"
                        className="block w-full h-full object-cover"
                      />
                      <p className="absolute bottom-0 right-0 w-6 h-6 bg-gray-200 text-xs md:text-sm text-[#6d6e72] font-semibold flex items-center justify-center rounded-tl-full">
                        x{it.quantity}
                      </p>
                    </div>
                    <div className="flex-1 ml-3">
                      <p className="text-sm md:text-[14px] text-[#111] font-semibold truncate">
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

                {data.status === "DELIVERED" && (
                  <div className="w-full mt-2">
                    {hasCommentedMap[`${data._id}_${it._id}`] ? (
                      <p className="text-gray-500 text-xs md:text-sm">
                        You have commented on this product.
                      </p>
                    ) : (
                      <div className="p-2 space-y-2">
                        <Input.TextArea
                          value={comments[it.product._id] || ""}
                          onChange={(e) =>
                            handleCommentChange(it.product._id, e)
                          }
                          rows={2}
                          placeholder="Leave a comment..."
                          className="border rounded-lg p-2 focus:ring-2 focus:ring-[#dc2626] transition duration-150 ease-in-out text-xs md:text-sm"
                        />
                        <Rate
                          value={ratings[it.product._id] || 0}
                          onChange={(value) =>
                            handleRatingChange(it.product._id, value)
                          }
                          className="mt-2"
                          allowHalf
                        />
                        <Button
                          type="primary"
                          onClick={() => handleCommentSubmit(it.product._id)}
                          className="mt-2 w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-lg text-xs md:text-sm"
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {data.products.length > MAX_PRODUCT && (
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
    </div>
  );
};

const OrderList = ({ data, onCommentSubmit, hasCommentedMap }) => {
  return (
    <div className="bg-[#ececec]">
      {data.map((it) => (
        <OrderCard
          key={`order-item-${it._id}`}
          data={it}
          onCommentSubmit={onCommentSubmit}
          hasCommentedMap={hasCommentedMap}
        />
      ))}
    </div>
  );
};

export default OrderList;
