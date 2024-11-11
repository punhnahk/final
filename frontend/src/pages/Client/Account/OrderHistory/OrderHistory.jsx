import { Empty, Input, message, Spin } from "antd";
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
  { id: 1, label: "All", value: "ALL" },
  { id: 2, label: "New", value: ORDER_STATUS.INITIAL },
  { id: 3, label: "Confirmed", value: ORDER_STATUS.CONFIRMED },
  { id: 4, label: "Delivering", value: ORDER_STATUS.DELIVERING },
  { id: 5, label: "Completed", value: ORDER_STATUS.DELIVERED },
  { id: 6, label: "Canceled", value: ORDER_STATUS.CANCELED },
];

const OrdersHistory = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [data, setData] = useState([]);
  const [hasCommentedMap, setHasCommentedMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrdersHistory();
      setData(res.data);
      await checkUserComments(res.data);
    } catch (error) {
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const checkUserComments = async (ordersData) => {
    try {
      const productIds = [
        ...new Set(
          ordersData.flatMap((order) =>
            order.products.map((product) => product.product._id)
          )
        ),
      ];

      const response = await commentApi.getCommentsByProductIds(productIds);

      const commentsByProduct = response.reduce((acc, comment) => {
        if (!acc[comment.productId]) {
          acc[comment.productId] = [];
        }
        acc[comment.productId].push(comment);
        return acc;
      }, {});

      const hasCommented = ordersData.reduce((acc, order) => {
        order.products.forEach((product) => {
          const productId = product.product._id;
          const userComments = commentsByProduct[productId] || [];

          const orderProductKey = `${order._id}_${productId}`;

          const hasCommentedForThisProduct = userComments.some(
            (comment) => comment.userId === userId
          );

          acc[orderProductKey] = hasCommentedForThisProduct;
        });
        return acc;
      }, {});

      setHasCommentedMap(hasCommented);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleCommentSubmit = async (orderId, productId, content, rating) => {
    try {
      // If rating is not provided, default it to 0
      const finalRating = rating !== undefined ? rating : 0;

      await commentApi.addComment({
        orderId,
        productId,
        content,
        rating: finalRating,
      });
      message.success("Comment and rating added successfully!");
    } catch (error) {
      message.error("You can only comment once on each product.");
    }
  };

  const renderTabs = () => (
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
  );

  return (
    <>
      <h2 className="text-[24px] font-semibold px-6 py-4 text-[#333] leading-tight">
        Order Management
      </h2>

      {renderTabs()}

      {/* Search box */}
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

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {/* Not found */}
          {!ordersFilter.length && (
            <div className="py-6">
              <Empty
                description={
                  <p className="text-[#111]">You have no orders yet.</p>
                }
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
      )}
    </>
  );
};

export default OrdersHistory;
