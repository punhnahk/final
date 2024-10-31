import crypto from "crypto";
import moment from "moment-timezone";
import querystring from "qs";
import Cart from "../models/carts.js";
import Order, {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  STATUS_ORDER,
} from "../models/orders.js";
import Product from "../models/products.js";
import Voucher from "../models/voucher.js";
import sortObject from "../utils/sortObject.js";

const OrderController = {
  createOrder: async (req, res) => {
    try {
      const orderBy = req.user.id;

      const {
        customerName,
        customerPhone,
        customerEmail,
        address,
        message,
        paymentMethod,
        voucherCode,
      } = req.body;

      const cart = await Cart.findOne({ user: orderBy }).exec();

      const productsOrder = [];
      for await (const item of cart.products) {
        const product = await Product.findById(item.product).exec();

        productsOrder.push({
          quantity: item.quantity,
          product,
        });
      }

      const totalPrice = productsOrder.reduce((total, item) => {
        const productPrice =
          item.product.salePrice > 0
            ? item.product.salePrice
            : item.product.price;
        const totalPrice = item.quantity * productPrice;

        total += totalPrice;

        return total;
      }, 0);

      // Kiểm tra mã voucher
      let discount = 0;

      if (voucherCode) {
        const voucher = await Voucher.findOne({ code: voucherCode }).exec();

        if (
          !voucher ||
          !voucher.isActive ||
          moment().isAfter(voucher.expirationDate)
        ) {
          return res
            .status(400)
            .json({ message: "Voucher không hợp lệ hoặc đã hết hạn." });
        }

        discount = (totalPrice * voucher.discountPercentage) / 100; // Tính toán giảm giá
      }

      const finalPrice = totalPrice - discount; // Cập nhật giá trị cuối cùng

      const order = await new Order({
        customerName,
        customerEmail,
        customerPhone,
        address,
        message,
        orderBy,
        totalPrice: finalPrice, // Sử dụng finalPrice
        products: productsOrder,
        paymentMethod,
        voucherCode,
        discountAmount: discount,
      }).save();

      // remove cart
      await Cart.deleteOne({ user: orderBy });

      // generate vnpay payment url
      if (paymentMethod === PAYMENT_METHOD.VNPAY) {
        const orderId = `NoelTechshop_${order._id}`;
        const paymentUrl = await createVNPayPaymentUrl({
          req,
          orderId,
          amount: finalPrice, // Sử dụng finalPrice
          orderInfo: `Thanh toan don hang ${orderId}`,
        });

        return res.status(201).json({
          paymentUrl,
        });
      }

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).exec();

      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  getAllMyOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.find({ orderBy: userId })
        .sort({ createdAt: -1 })
        .exec();

      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  getOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).exec();

      if (!order) {
        return res.status(500).json({ message: "Order not found!" });
      }

      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, paymentStatus } = req.body;

      if (status && !STATUS_ORDER.includes(status)) {
        return res.status(400).json({ message: "Status is not valid" });
      }

      if (paymentStatus && !PAYMENT_STATUS.includes(paymentStatus)) {
        return res.status(400).json({ message: "Status is not valid" });
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status, paymentStatus },
        { new: true }
      ).exec();

      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

const createVNPayPaymentUrl = async ({ req, orderId, amount, orderInfo }) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_SECRET_KEY;
    let vnpUrl = process.env.VNPAY_VNP_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const createDate = moment().tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmss");
    const expiredDate = moment()
      .tz("Asia/Ho_Chi_Minh")
      .add(10, "minutes")
      .format("YYYYMMDDHHmmss");

    const currCode = "VND";
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expiredDate,
      vnp_Locale: "vn",
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  } catch (error) {
    console.error("Error generating VNPay URL:", error.message);
    throw new Error("Failed to create VNPay payment URL");
  }
};

export default OrderController;
