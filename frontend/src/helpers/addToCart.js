import { toast } from "react-toastify";
import SummaryApi from "../common";

const addToCart = async (e, id) => {
  e?.stopPropagation();
  //Stop cái chuyển page để tránh load lại cả page. Chỉ load lại form của page.
  e?.preventDefault();
  //chỉ xử lý page hiện tại

  const response = await fetch(SummaryApi.addToCartProduct.url, {
    method: SummaryApi.addToCartProduct.method,
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ productId: id }),
  });

  const responseData = await response.json();

  if (responseData.success) {
    toast.success(responseData.message);
  }

  if (responseData.error) {
    toast.error(responseData.message);
  }

  return responseData;
};

export default addToCart;
