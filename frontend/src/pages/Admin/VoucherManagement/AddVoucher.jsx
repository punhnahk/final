import { message } from "antd"; // Import Ant Design's message component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import voucherApi from "../../../api/voucherApi";
import { ROUTE_PATH } from "../../../constants/routes";

const AddVoucher = () => {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      code,
      discountPercentage: Number(discountPercentage),
      expirationDate,
    };

    try {
      await voucherApi.createVoucher(data);
      setCode("");
      setDiscountPercentage("");
      setExpirationDate("");
      message.success("Voucher created successfully"); // Success message
      navigate(ROUTE_PATH.VOUCHER_MANAGEMENT);
    } catch (error) {
      console.error("Error creating voucher:", error);
      message.error("Failed to create voucher"); // Error message
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddVoucher;
