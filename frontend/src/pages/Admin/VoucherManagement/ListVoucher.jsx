import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import voucherApi from "../../../api/voucherApi";
import { ROUTE_PATH } from "../../../constants/routes";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await voucherApi.getVouchers();
      setVouchers(response.data);
    } catch (error) {
      message.error("Failed to fetch vouchers");
    }
  };

  const handleDelete = async (id) => {
    try {
      await voucherApi.deleteVoucher(id);
      message.success("Successfully deleted the voucher");
      fetchVouchers();
    } catch (error) {
      message.error("Failed to delete voucher");
    }
  };

  const toggleActiveStatus = async (voucher) => {
    try {
      const updatedVoucher = { ...voucher, isActive: !voucher.isActive };
      await voucherApi.updateVoucher(updatedVoucher._id, updatedVoucher);
      message.success("Successfully updated the voucher status");
      fetchVouchers();
    } catch (error) {
      message.error("Failed to update voucher status");
    }
  };

  // Open modal to input multiple emails
  const showEmailModal = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setIsModalVisible(true);
  };

  // Handle sending voucher to multiple emails
  const handleSendVoucher = async () => {
    const emailList = emailInput.split(",").map((email) => email.trim());
    if (emailList.some((email) => !email)) {
      message.error("Please enter valid email addresses.");
      return;
    }

    try {
      await voucherApi.sendVoucher(selectedVoucherId, emailList);
      message.success("Voucher sent successfully to all recipients!");
      setIsModalVisible(false);
      setEmailInput("");
    } catch (error) {
      message.error("Failed to send voucher.");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt",
      render: (_, __, index) => ++index,
    },
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Discount (%)",
      dataIndex: "discountPercentage",
    },
    {
      title: "Expiry Date",
      dataIndex: "expirationDate",
      render: (date) => <p>{new Date(date).toLocaleDateString()}</p>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive, row) => (
        <Button
          onClick={() => toggleActiveStatus(row)}
          type={isActive ? "primary" : "default"}
          icon={isActive ? <CheckOutlined /> : <CloseOutlined />}
        >
          {isActive ? "Active" : "Inactive"}
        </Button>
      ),
    },
    {
      title: "Users Applied",
      dataIndex: "usageCount",
      render: (usageCount) => <p>{usageCount}</p>,
    },
    {
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-x-3">
          <Link to={ROUTE_PATH.EDIT_VOUCHER(row._id)}>
            <EditOutlined className="text-lg" />
          </Link>
          <ShareAltOutlined
            className="cursor-pointer text-lg"
            onClick={() => showEmailModal(row._id)}
          />
          <Popconfirm
            title="Delete Voucher"
            description="Are you sure you want to delete this voucher?"
            onConfirm={() => handleDelete(row._id)}
          >
            <DeleteOutlined className="cursor-pointer text-lg" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Voucher Management</h1>
      <button
        onClick={() => navigate(ROUTE_PATH.ADD_VOUCHER)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Voucher
      </button>
      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="_id"
        scroll={{ x: 900 }}
      />

      {/* Modal for email input */}
      <Modal
        title="Enter Recipient Email(s)"
        visible={isModalVisible}
        onOk={handleSendVoucher}
        onCancel={() => setIsModalVisible(false)}
        okText="Send Voucher"
      >
        <p>Enter one or more emails separated by commas:</p>
        <Input
          placeholder="email1@example.com, email2@example.com"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default VoucherList;
