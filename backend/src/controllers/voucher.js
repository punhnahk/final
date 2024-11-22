import Voucher from "../models/voucher.js";
import VoucherUsage from "../models/voucherUsage.js";
import sendMail from "../utils/sendMail.js";
const VoucherController = {
  createVoucher: async (req, res) => {
    try {
      const { code, discountPercentage, expirationDate } = req.body;

      const existingVoucher = await Voucher.findOne({ code }).exec();
      if (existingVoucher) {
        return res
          .status(400)
          .json({ message: "Voucher code already exists." });
      }

      const voucher = new Voucher({
        code,
        discountPercentage,
        expirationDate,
        isActive: true,
      });

      await voucher.save();
      res
        .status(201)
        .json({ message: "Voucher created successfully", voucher });
    } catch (error) {
      console.error("Error details:", error); // Log the entire error object
      res
        .status(500)
        .json({ message: "Error creating voucher", error: error.message });
    }
  },

  // Get all vouchers
  getAllVouchers: async (req, res) => {
    const THRESHOLD = 20;
    try {
      const vouchers = await Voucher.find().exec();

      const voucherDetails = [];

      for (const voucher of vouchers) {
        const usageCount = await VoucherUsage.countDocuments({
          voucherId: voucher._id,
        }).exec();
        if (usageCount > THRESHOLD) {
          voucher.isActive = false;
          await voucher.save();
        }
        voucherDetails.push({
          ...voucher.toObject(),
          usageCount: usageCount,
        });
      }

      res.json(voucherDetails);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching vouchers", error: error.message });
    }
  },

  // Get a specific voucher by ID
  getVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findById(id).exec();

      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      res.json(voucher);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching voucher", error: error.message });
    }
  },

  // Update a voucher
  updateVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      const { code, discountPercentage, expirationDate, isActive } = req.body;

      const updatedVoucher = await Voucher.findByIdAndUpdate(
        id,
        { code, discountPercentage, expirationDate, isActive },
        { new: true }
      ).exec();

      if (!updatedVoucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      res.json({ message: "Voucher updated successfully", updatedVoucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating voucher", error: error.message });
    }
  },

  // Delete a voucher
  deleteVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedVoucher = await Voucher.findByIdAndDelete(id).exec();

      if (!deletedVoucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      res.json({ message: "Voucher deleted successfully", deletedVoucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting voucher", error: error.message });
    }
  },
  getVoucherByCode: async (req, res) => {
    try {
      const { code } = req.params;
      const userId = req.user.id;

      const voucher = await Voucher.findOne({ code }).exec();

      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      if (!voucher.isActive) {
        return res.status(400).json({ message: "Voucher is not active." });
      }

      const currentDate = new Date();
      if (new Date(voucher.expirationDate) < currentDate) {
        return res.status(400).json({ message: "Voucher has expired." });
      }

      const voucherUsage = await VoucherUsage.findOne({
        userId,
        voucherId: voucher._id,
      }).exec();

      if (voucherUsage) {
        return res
          .status(400)
          .json({ message: "Voucher has already been used by this user." });
      }

      const newVoucherUsage = new VoucherUsage({
        userId,
        voucherId: voucher._id,
        usedAt: new Date(),
      });

      await newVoucherUsage.save();
      res.json(voucher);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching voucher", error: error.message });
    }
  },

  sendVoucher: async (req, res) => {
    try {
      const { id } = req.params; // Voucher ID from URL parameter
      const { email } = req.body; // Recipient email from request body

      // Now you can use `id` directly in your database query
      const voucher = await Voucher.findById(id);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found." });
      }

      // Check if the voucher has expired
      const currentDate = new Date();
      if (new Date(voucher.expirationDate) < currentDate) {
        return res.status(400).json({ message: "Voucher has expired." });
      }

      // Check the voucher's status
      if (!voucher.isActive) {
        return res.status(400).json({ message: "Voucher is not active." });
      }

      // Create the email content for the voucher
      const emailContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background-color: #f9f9f9;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4CAF50;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
        }
        .voucher-code {
          font-size: 1.2em;
          font-weight: bold;
          color: #ff5722;
        }
        .cta {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        footer {
          margin-top: 20px;
          font-size: 0.8em;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Congratulations!</h1>
        <p>You've received a discount voucher:</p>
        <ul>
          <li><strong>Voucher Code:</strong> <span class="voucher-code">${
            voucher.code
          }</span></li>
          <li><strong>Discount Value:</strong> ${
            voucher.discountPercentage
          }%</li>
          <li><strong>Expiration Date:</strong> ${new Date(
            voucher.expirationDate
          ).toLocaleDateString()}</li>
        </ul>
        <p>Use this code at our store to get your discount!</p>
        <a href="https://noel.id.vn" class="cta">Shop Now</a>
      </div>
      <footer>
        <p>Thank you for choosing our store! If you have any questions, feel free to contact us.</p>
      </footer>
    </body>
  </html>
`;

      // Send the voucher email
      await sendMail({
        toEmail: email,
        title: "Your discount voucher is ready!",
        content: emailContent,
      });

      res
        .status(200)
        .json({ message: "Voucher sent successfully to " + email });
    } catch (error) {
      console.error("Error details:", error);
      res
        .status(500)
        .json({ message: "Error sending voucher", error: error.message });
    }
  },
};

export default VoucherController;
