import crypto from "crypto";
import moment from "moment-timezone";
import querystring from "qs";
import Cart from "../models/carts.js";
import Order, { PAYMENT_METHOD } from "../models/orders.js";
import Product from "../models/products.js";
import Voucher from "../models/voucher.js";
import sendMail from "../utils/sendMail.js";
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

      if (!address || address.trim() === "") {
        return res.status(400).json({
          status: false,
          message: "Address is required for placing an order",
        });
      }

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
      let discount = 0;

      if (voucherCode) {
        const voucher = await Voucher.findOne({ code: voucherCode }).exec();

        if (
          !voucher ||
          !voucher.isActive ||
          moment().isAfter(voucher.expirationDate)
        ) {
          return res.status(400);
        }

        discount = (totalPrice * voucher.discountPercentage) / 100;
      }

      const finalPrice = totalPrice - discount;

      const order = await new Order({
        customerName,
        customerEmail,
        customerPhone,
        address,
        message,
        orderBy,
        totalPrice: finalPrice,
        products: productsOrder,
        paymentMethod,
        voucherCode,
        discountAmount: discount,
      }).save();

      // remove cart
      await Cart.deleteOne({ user: orderBy });

      await sendMail({
        toEmail: customerEmail,
        title: "Order Confirmation - Your Order has been Placed Successfully",
        content: `
  <html>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc; color: #333;">
      <table role="presentation" style="width: 100%; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="text-align: center; padding-bottom: 20px;">
            <h2 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;">Order Confirmation</h2>
            <p style="font-size: 16px; color: #777;">Thank you for your purchase!</p>
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>We are excited to confirm that we have received your order. Below are the details:</p>
            <table style="width: 100%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Order ID</td>
                <td style="padding: 10px; background-color: #fff;">${
                  order._id
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Total Price</td>
                <td style="padding: 10px; background-color: #fff;">${finalPrice} VND</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Shipping Address</td>
                <td style="padding: 10px; background-color: #fff;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f8f8f8; font-weight: bold;">Message</td>
                <td style="padding: 10px; background-color: #fff;">${
                  message || "No message provided"
                }</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">Your order is being processed and we will notify you once it is shipped. We appreciate your trust in us!</p>
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; line-height: 1.6; color: #777; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>If you have any questions or concerns, feel free to reach out to our customer support.</p>
            <p>Best regards,</p>
            <p><strong>Noel Techshop</strong></p>
            <p style="font-size: 12px; color: #aaa;">&copy; 2024 Noel Techshop | All Rights Reserved</p>
          </td>
        </tr>
      </table>
    </body>
  </html>
`,
      });

      if (paymentMethod === PAYMENT_METHOD.VNPAY) {
        const orderId = `NoelTechshop_${order._id}`;
        const paymentUrl = await createVNPayPaymentUrl({
          req,
          orderId,
          amount: finalPrice,
          orderInfo: `Pyament order is ${orderId}`,
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
      const orderId = req.params.id;
      const { status } = req.body;

      // Find the order by ID and update its status
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
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
