import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../common/index";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const fetchAllUser = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });
    const dataResponse = await fetchData.json();
    if (dataResponse.success) {
      setAllUser(dataResponse.data, {
        position: "bottom-right",
      });
    }
    if (dataResponse.error) {
      toast.error(dataResponse.message, {
        position: "bottom-right",
      });
    }
  };
  useEffect(() => {
    fetchAllUser();
  }, []);
  return (
    <div className="bg-white pb-4">
      <table className="w-full userTable">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="">
          {allUser.map((el, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{el?.name}</td>
                <td>{el?.email}</td>
                <td>{el?.phone}</td>
                <td>{el?.address}</td>
                <td>{el?.role}</td>
                <td>{moment(el?.createdAt).format("LL")}</td>
                <td>
                  <button className="">Edit</button>
                  <button>Remove</button>
                  <button>Reset Password</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllUser;
