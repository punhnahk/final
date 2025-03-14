import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../constants/routes";
import formatPrice from "../../utils/formatPrice";

const ProductItem = ({ className, data }) => {
  const originPrice = data.price;
  const salePrice = data.salePrice;

  // Calculate the discount percentage
  const discountPercentage =
    salePrice > 0
      ? Math.round(((originPrice - salePrice) / originPrice) * 100)
      : 0;

  return (
    <div
      className={classNames(
        className,
        "bg-white rounded-lg hover:shadow transition-all px-2 pt-2 pb-6 group"
      )}
    >
      <Link
        to={ROUTE_PATH.PRODUCT_DETAIL(data._id)}
        className="relative pt-[100%] block overflow-hidden"
      >
        <img
          src={data.image[0]}
          loading="lazy"
          alt="Product"
          className="block absolute w-full h-full top-0 right-0 bottom-0 left-0 object-cover transition-all"
        />

        {/* Display the discount percentage in the top-left corner */}
        {salePrice > 0 && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded-md opacity-75">
            Save {discountPercentage}%
          </div>
        )}
      </Link>

      {salePrice > 0 && (
        <p className="text-xs text-[#6b7280]">{formatPrice(originPrice)}</p>
      )}

      <p className="text-[#090d14] font-semibold">
        {formatPrice(salePrice > 0 ? salePrice : originPrice)}
      </p>

      {salePrice > 0 && (
        <div>
          <p className="text-xs text-[#059669] mt-1">
            Discount: {formatPrice(originPrice - salePrice)}
          </p>
        </div>
      )}

      <div className="text-[#090d14] mt-3 text-sm h-[40px] overflow-hidden text-ellipsis whitespace-wrap">
        <Link
          to={ROUTE_PATH.PRODUCT_DETAIL(data._id)}
          aria-label={`View details for ${data.name}`}
        >
          {data.name}
        </Link>
      </div>

      <div className="mt-2 pt-3 border-t border-[#e5e7eb]">
        <div className="flex gap-1 mb-2">
          <img
            src="https://cdn2.fptshop.com.vn/svg/vnpay_icon_ba16ea588c.svg"
            alt="VNPay"
            className="w-10 h-10 "
          />
        </div>
        <p className="text-xs text-[#6b7280]">
          Pay with VN Pay: Additional discount of 400,000 VND
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
