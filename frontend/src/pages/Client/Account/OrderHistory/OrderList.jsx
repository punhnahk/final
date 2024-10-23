import { Button, Input, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import formatPrice from "../../../../utils/formatPrice";
import { getOrderStatus } from "../../../../utils/order";

const MAX_PRODUCT = 2;

const OrderCard = ({ data, onCommentSubmit, hasCommentedMap }) => {
  const [showMore, setShowMore] = useState(false);
  const [comments, setComments] = useState({});

  const handleToggleProducts = () => {
    setShowMore(!showMore);
  };

  const handleCommentChange = (productId, e) => {
    setComments({
      ...comments,
      [productId]: e.target.value,
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
      await onCommentSubmit(data._id, productId, comments[productId]);
      // Reset the comment input after submission
      setComments((prev) => ({
        ...prev,
        [productId]: "",
      }));
    } catch {
      message.error("Failed to submit comment.");
    }
  };

  return (
    <div className="pt-4 px-6 pb-6 rounded bg-white [&:not(:last-child)]:mb-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#CFCFCF]">
        <p className="text-[#6d6e72] text-[14px] font-semibold">
          {getOrderStatus(data.status)}
        </p>

        <p className="text-[14px] text-[#111] font-semibold">#{data._id}</p>
      </div>

      <div className="py-4 mb-3 border-b border-[#CFCFCF]">
        {data.products
          .slice(0, showMore ? data.products.length : MAX_PRODUCT)
          .map((it) => {
            const salePrice = it.product.salePrice;
            const productPrice = it.product.price;
            const totalPriceSale = salePrice * it.quantity;
            const totalPriceBeforeSale = productPrice * it.quantity;

            return (
              <div
                className="flex items-center"
                key={`order-product-item-${it._id}`}
              >
                <div className="p-2 w-3/4 flex items-center gap-x-2">
                  <Link
                    to={ROUTE_PATH.PRODUCT_DETAIL(it.product._id)}
                    className="flex items-center"
                  >
                    <div className="w-[90px] h-[90px] border border-[#eee] rounded overflow-hidden relative">
                      <img
                        src={it.product.image[0]}
                        alt="Product img"
                        className="block w-full h-full object-cover"
                      />
                      <p className="absolute bottom-0 right-0 w-6 h-6 bg-[#ececec] rounded-tl flex items-center justify-center text-[12px] text-[#6d6e72] font-semibold">
                        x{it.quantity}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#111] font-semibold ml-5">
                        {it.product.name}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="w-1/4 text-[#111] text-right">
                  <p>
                    {formatPrice(
                      salePrice ? totalPriceSale : totalPriceBeforeSale
                    )}
                  </p>
                  {salePrice > 0 && (
                    <p className="line-through text-[14px]">
                      {formatPrice(totalPriceBeforeSale)}
                    </p>
                  )}
                </div>

                {data.status === "DELIVERED" && (
                  <>
                    {hasCommentedMap[`${data._id}_${it.product._id}`] ? (
                      <p className="text-gray-500">
                        You have commented on this product.
                      </p>
                    ) : (
                      <div className="w-full p-2 pl-10 pr-6">
                        <Input.TextArea
                          value={comments[it.product._id] || ""}
                          onChange={(e) =>
                            handleCommentChange(it.product._id, e)
                          }
                          rows={2}
                          placeholder="Leave a comment..."
                          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition duration-150 ease-in-out"
                        />
                        <Button
                          type="primary"
                          onClick={() => handleCommentSubmit(it.product._id)}
                          className="mt-2 w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-lg transition duration-150 ease-in-out"
                        >
                          Submit Comment
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>

      {data.products.length > MAX_PRODUCT && (
        <Button className="rounded" onClick={handleToggleProducts}>
          {showMore
            ? "Show less products"
            : `View ${data.products.length - MAX_PRODUCT} more products`}
        </Button>
      )}

      <div className="text-right">
        <p>
          <span>Total: </span>
          <span className="text-[#e30019] font-semibold">
            {formatPrice(data.totalPrice)}
          </span>
        </p>

        <Link
          to={ROUTE_PATH.ORDER_HISTORY_DETAIL(data._id)}
          className="border border-[#1982f9] rounded px-3 h-9 text-[14px] text-[#1982f9] inline-flex items-center mt-2"
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
