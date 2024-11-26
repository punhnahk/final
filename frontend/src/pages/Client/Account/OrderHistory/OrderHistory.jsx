import { Empty, Input, message, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import orderApi from "../../../../api/orderApi";
import { ORDER_STATUS } from "../../../../constants";
import { ROUTE_PATH } from "../../../../constants/routes";
import useProfile from "../../../../hooks/useProfile";
import styles from "./index.module.css";
import OrderList from "./OrderList";

// Tab definitions
const TABS = [
  { id: 1, label: "All", value: "ALL" },
  { id: 2, label: "New", value: ORDER_STATUS.INITIAL },
  { id: 3, label: "Confirmed", value: ORDER_STATUS.CONFIRMED },
  { id: 4, label: "Delivering", value: ORDER_STATUS.DELIVERING },
  { id: 5, label: "Completed", value: ORDER_STATUS.DELIVERED },
  { id: 6, label: "Canceled", value: ORDER_STATUS.CANCELED },
];

const OrdersHistory = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();
  const userId = profile?._id;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orders = await orderApi.getOrdersHistory();
      setData(orders.data);
    } catch (error) {
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const ordersFilter = useMemo(() => {
    return data.filter(
      (order) =>
        (activeTab === "ALL" || order.status === activeTab) &&
        order.products.some((product) =>
          product.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [data, activeTab, searchQuery]);

  return (
    <>
      <h2 className="text-[24px] font-semibold px-6 py-4 text-[#333] leading-tight">
        Order Management
      </h2>
      {renderTabs()}
      <div className="bg-gray-100 p-4">
        <Input
          placeholder="Search orders by product name"
          className="my-3 rounded"
          size="large"
          prefix={<IoSearchSharp className="text-[#111] text-[16px]" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? <Spin size="large" /> : renderOrders()}
    </>
  );

  function renderTabs() {
    return (
      <div className="flex items-center justify-between mt-3 overflow-x-auto">
        {TABS.map((tab) => (
          <p
            key={tab.id}
            className={`${styles.tabItem} ${
              activeTab === tab.value && styles.active
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            <span>{tab.label}</span>
            {activeTab === tab.value && (
              <span className="text-[#ff3c53]"> ({ordersFilter.length})</span>
            )}
          </p>
        ))}
      </div>
    );
  }

  function renderOrders() {
    if (!ordersFilter.length) {
      return (
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
      );
    }
    return <OrderList data={ordersFilter} />;
  }
};

export default OrdersHistory;
