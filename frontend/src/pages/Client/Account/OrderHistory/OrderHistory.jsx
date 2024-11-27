import { Button, Empty, Input, message, Select, Spin } from "antd";
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
  const [visibleOrders, setVisibleOrders] = useState(3); // State to control the number of visible orders
  const [sortOrder, setSortOrder] = useState("newest"); // State to track sorting option (newest or oldest)
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
    // Filter orders by active tab and search query
    const filteredOrders = data.filter((order) => {
      // Check if searchQuery matches the last 5 characters of order ID
      const orderIdEndsWithSearchQuery = order._id
        .slice(-5)
        .includes(searchQuery);

      // Check if product name matches searchQuery
      const productMatchesQuery = order.products.some((product) =>
        product.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Return orders that match either the order ID (last 5 chars) or product name
      return (
        (activeTab === "ALL" || order.status === activeTab) &&
        (orderIdEndsWithSearchQuery || productMatchesQuery)
      );
    });

    // Sort orders based on selected sort option
    return filteredOrders.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by newest
      }
      return new Date(a.createdAt) - new Date(b.createdAt); // Sort by oldest
    });
  }, [data, activeTab, searchQuery, sortOrder]);

  const handleShowMoreOrders = () => {
    setVisibleOrders((prev) => prev + 4); // Load 4 more orders each time
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Order Management
        </h2>
        {renderTabs()}
        {ordersFilter.length > 0 && (
          <div className="flex items-center justify-between bg-red-200 p-3 mb-6 mt-2 rounded-lg shadow-md">
            <Input
              placeholder="Search orders by product name or order ID (last 5 chars)"
              className="w-full sm:w-3/4 md:w-2/3 lg:w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e30019] transition-all"
              size="large"
              prefix={<IoSearchSharp className="text-gray-600 text-xl" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              defaultValue="newest"
              onChange={(value) => setSortOrder(value)}
              className="ml-4 w-auto bg-white border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#e30019] transition-all"
              size="large"
            >
              <Select.Option value="newest">Newest</Select.Option>
              <Select.Option value="oldest">Oldest</Select.Option>
            </Select>
          </div>
        )}

        {loading ? <Spin size="large" className="my-4" /> : renderOrders()}
      </div>
    </div>
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
            description={
              <p className="text-gray-600">You have no orders yet.</p>
            }
          />
          <div className="text-center mt-4">
            <Link
              to={ROUTE_PATH.PRODUCTS_LIST}
              className="bg-[#e30019] text-white rounded-full py-2 px-6"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }

    const displayedOrders = ordersFilter.slice(0, visibleOrders); // Show only the visible orders

    return (
      <>
        <OrderList data={displayedOrders} />
        {ordersFilter.length > visibleOrders && (
          <div className="text-right mt-6">
            <Button
              onClick={handleShowMoreOrders}
              className="text-sm text-[#e30019] bg-transparent border-0 hover:text-[#e30019] transition-all"
            >
              Show More
            </Button>
          </div>
        )}
      </>
    );
  }
};

export default OrdersHistory;
