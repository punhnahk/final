import { Empty, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import orderApi from "../../../../api/orderApi";
import { ORDER_STATUS } from "../../../../constants";
import { ROUTE_PATH } from "../../../../constants/routes";
import styles from "./index.module.css";
import OrderList from "./OrderList";

const TABS = [
  {
    id: 1,
    label: "All",
    value: "ALL",
  },
  {
    id: 2,
    label: "New",
    value: ORDER_STATUS.INITIAL,
  },
  {
    id: 3,
    label: "Confirmed",
    value: ORDER_STATUS.CONFIRMED,
  },
  {
    id: 4,
    label: "Delivering",
    value: ORDER_STATUS.DELIVERING,
  },
  {
    id: 5,
    label: "Completed",
    value: ORDER_STATUS.DELIVERED,
  },
  {
    id: 6,
    label: "Canceled",
    value: ORDER_STATUS.CANCELED,
  },
];

const OrdersHistory = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);

  const [data, setData] = useState([]);

  const ordersFilter = useMemo(() => {
    if (activeTab === "ALL") {
      return data;
    }

    return data.filter((it) => it.status === activeTab);
  }, [data, activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await orderApi.getOrdersHistory();
      setData(res.data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  return (
    <>
      <h2 className="text-[24px] font-semibold px-6 py-4 text-[#333] leading-tight">
        Order Management
      </h2>

      {/* tab */}
      <div className="flex items-center justify-between mt-3 overflow-x-auto">
        {TABS.map((it, idx) => (
          <p
            key={idx}
            className={`${styles.tabItem} ${
              activeTab === it.value && styles.active
            }`}
            onClick={() => setActiveTab(it.value)}
          >
            <span>{it.label}</span>

            {activeTab === it.value && (
              <span className="text-[#ff3c53]"> ({ordersFilter.length})</span>
            )}
          </p>
        ))}
      </div>

      {/* search box */}
      <div className="bg-gray-100">
        <br />
        {/* <Input
          placeholder="Search orders by Order ID"
          className="my-3 rounded"
          size="large"
          prefix={<IoSearchSharp className="text-[#111] text-[16px]" />}
          suffix={
            <p className="text-[#1982f9] cursor-pointer">Search Orders</p>
          }
        /> */}
      </div>

      {/* not found */}
      {!ordersFilter.length && (
        <div className="py-6">
          <Empty
            description={<p className="text-[#111]">You have no orders yet.</p>}
          />

          <div className="text-center mt-4">
            <Link
              to={ROUTE_PATH.PRODUCTS_LIST}
              className="bg-[#e30019] rounded h-[40px] inline-flex text-white items-center px-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {!!ordersFilter.length && <OrderList data={ordersFilter} />}
    </>
  );
};

export default OrdersHistory;
