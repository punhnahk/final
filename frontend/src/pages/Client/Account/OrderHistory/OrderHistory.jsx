import { Empty, Input, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import commentApi from "../../../../api/commentApi";
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

const OrdersHistory = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [data, setData] = useState([]);
  const [hasCommentedMap, setHasCommentedMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const ordersFilter = useMemo(() => {
    let filteredOrders =
      activeTab === "ALL" ? data : data.filter((it) => it.status === activeTab);

    if (searchQuery) {
      filteredOrders = filteredOrders.filter((order) =>
        order.products.some((product) =>
          product.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return filteredOrders;
  }, [data, activeTab, searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    checkUserComments();
  }, [data]);

  const fetchData = async () => {
    try {
      const res = await orderApi.getOrdersHistory();
      setData(res.data);
    } catch (error) {
      message.error("Failed to fetch orders");
    }
  };

  const checkUserComments = async () => {
    try {
      const promises = data.flatMap((order) =>
        order.products.map(async (product) => {
          const response = await commentApi.checkComment({
            productId: product.product._id,
            userId: userId,
            orderId: order._id,
          });
          return {
            productId: product.product._id,
            orderId: order._id,
            hasCommented: response.data.hasCommented,
          };
        })
      );

      const results = await Promise.all(promises);
      const hasCommented = results.reduce(
        (acc, { productId, orderId, hasCommented }) => {
          acc[`${orderId}_${productId}`] = hasCommented;
          return acc;
        },
        {}
      );

      setHasCommentedMap(hasCommented);
    } catch (error) {
      console.error("Failed to check comments", error);
    }
  };

  const handleCommentSubmit = async (orderId, productId, content) => {
    try {
      await commentApi.addComment({
        orderId: orderId,
        productId: productId,
        content: content,
      });
      message.success("Comment added successfully!");
    } catch (error) {
      message.error("You have already commented on this product.");
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

      {!!ordersFilter.length && (
        <OrderList
          data={ordersFilter}
          onCommentSubmit={handleCommentSubmit}
          hasCommentedMap={hasCommentedMap}
        />
      )}
    </>
  );
};

export default OrdersHistory;
