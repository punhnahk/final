import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Image, message, Popconfirm, Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../../../api/userApi";
import { DEFAULT_AVATAR_PATH } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";

const UserList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await userApi.getUsers();
      setData(data);
    } catch (error) {
      message.error("Failed to fetch", error.message);
    }
  };

  const onDeleteUser = async (id) => {
    try {
      await userApi.deleteUser(id);
      message.success("User account deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt",
      render: (_, __, index) => ++index,
    },
    {
      title: "User",
      key: "user",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-x-2">
            <Image
              src={row.avatar || DEFAULT_AVATAR_PATH}
              width={56}
              height={56}
              className="object-cover rounded-full"
            />

            <div>
              <p>{row.name}</p>
              <p>{row.email}</p>
              <p>{row.phone}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Birthday",
      key: "birthday",
      dataIndex: "birthday",
      render: (val) => val && dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Gender",
      key: "gender",
      dataIndex: "gender",
      render: (val) => {
        switch (val) {
          case "MALE":
            return "Male";
          case "FEMALE":
            return "Female";
          case "OTHER":
            return "Other";
          default:
            return "";
        }
      },
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (role) => (role === "ADMIN" ? "Administrator" : "User"),
    },
    {
      title: "Login Method", // New column for login method
      key: "loginMethod",
      dataIndex: "loginMethod", // This field should be returned by your API
      render: (method) => (method === "google" ? "Google" : "Password"), // Display login method
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (val) => dayjs(val).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-x-3">
            <Link to={ROUTE_PATH.EDIT_USER(row._id)}>
              <EditOutlined className="text-lg" />
            </Link>

            <Popconfirm
              title="Delete User"
              description="Confirm delete user"
              onConfirm={() => onDeleteUser(row._id)}
            >
              <DeleteOutlined className="cursor-pointer text-lg" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">User Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default UserList;
