import moment from "moment";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { MdLockReset } from "react-icons/md";
import { toast } from "react-toastify";
import SummaryApi from "../common/index";
import ChangeUserRole from "../components/user/ChangeUserRole";
const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    role: "",
    _id: "",
  });
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
                <td className="">
                  <button
                    className="bg-green-50 p-2 cursor-pointer hover:bg-green-300 hover:text-white rounded-full"
                    onClick={() => {
                      setUpdateUserDetails(el);
                      setOpenUpdateRole(true);
                    }}
                  >
                    <CiEdit />
                  </button>
                  <button className="bg-red-50 p-2 cursor-pointer hover:bg-red-300 hover:text-white rounded-full">
                    <IoIosRemoveCircleOutline />
                  </button>
                  <button className="bg-blue-50 p-2 cursor-pointer hover:bg-blue-300 hover:text-white rounded-full">
                    <MdLockReset />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          phone={updateUserDetails.phone}
          address={updateUserDetails.address}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUser}
        />
      )}
    </div>
  );
};

export default AllUser;
