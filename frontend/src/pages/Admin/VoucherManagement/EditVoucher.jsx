import { message } from "antd"; // Import Ant Design's message component
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import voucherApi from "../../../api/voucherApi";
import { ROUTE_PATH } from "../../../constants/routes";

const EditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await voucherApi.getVoucher(id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching voucher:", error);
        message.error("Failed to fetch voucher data"); // Error message
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await voucherApi.updateVoucher(id, formData);
      message.success("Voucher updated successfully"); // Success message
      navigate(ROUTE_PATH.VOUCHER_MANAGEMENT);
    } catch (error) {
      console.error("Error updating voucher:", error);
      message.error("Failed to update voucher"); // Error message
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
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
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditPage;
