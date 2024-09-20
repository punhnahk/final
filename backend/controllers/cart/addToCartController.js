import addToCartModel from "../../models/cartProduct.js";
import Payment from "../../models/paymentModel.js"; //
import createPaymentUrl from "../../providers/vnpay/service.js"; // Import the VNPay service

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    const isProductAvailable = await addToCartModel.findOne({ productId });

    console.log("isProductAvailable   ", isProductAvailable);

    if (isProductAvailable) {
      return res.json({
        message: "Already exists in Add to cart",
        success: false,
        error: true,
      });
    }

    const payload = {
      productId: productId,
      quantity: 1,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.json({
      data: saveProduct,
      message: "Product Added in Cart",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

// Add the new function to handle payment creation
const createPayment = async (req, res) => {
  try {
    const { orderId, productId, amount } = req.body; // Expect productId and amount from the request
    const userId = req.userId;
    const ipAddr =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const returnUrl = "http://localhost:3000/vnpay_return"; // Your return URL after payment

    // Call the VNPay service to create the payment URL
    const paymentUrl = createPaymentUrl(orderId, amount, returnUrl, ipAddr);

    // Save the payment details to the database
    const newPayment = new Payment({
      productId: productId,
      userId: userId,
      totalPay: amount,
    });

    await newPayment.save(); // Save the payment history

    // Redirect the user to the payment URL
    return res.redirect(paymentUrl);
  } catch (error) {
    console.error("Error creating payment: ", error);
    return res
      .status(500)
      .json({ message: "Error creating payment URL", error });
  }
};

// Handle VNPay return logic
const handleVnpayReturn = async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = require("../../config/vnpay");
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
};

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

export { addToCartController, createPayment, handleVnpayReturn };
