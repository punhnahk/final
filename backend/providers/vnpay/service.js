import crypto from "crypto";
import querystring from "qs";

const createPaymentUrl = (orderId, amount, returnUrl, ipAddr) => {
  const vnp_TmnCode = process.env.VNP_TMNCODE;
  const vnp_HashSecret = process.env.VNP_HASHSECRET;
  const vnp_Url = process.env.VNP_URL;
  const vnp_ReturnUrl = returnUrl;

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
  vnp_Params["vnp_Amount"] = amount * 100; // Amount in VNĐ, multiplied by 100
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = `Payment for order ${orderId}`;
  vnp_Params["vnp_OrderType"] = "billpayment";
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[-T:.]/g, "");
  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params);
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params)}`;
  return paymentUrl;
};

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

export default createPaymentUrl;
