import { Button } from "antd";
import { useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import formatPrice from "../../../../utils/formatPrice";
import { getOrderStatus } from "../../../../utils/order";

const MAX_PRODUCT = 2;

const OrderCard = ({ data }) => {
  const [showMore, setShowMore] = useState(false); // State to manage visibility of more products

  const handleToggleProducts = () => {
    setShowMore(!showMore); // Toggle the state
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
                    <p className="text-[#111] font-semibold">
                      {it.product.name}
                    </p>
                  </div>
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

const OrderList = ({ data }) => {
  return (
    <div className="bg-[#ececec]">
      {data.map((it) => (
        <OrderCard key={`order-item-${it._id}`} data={it} />
      ))}
    </div>
  );
};

export default OrderList;
