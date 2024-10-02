import { CreditCardOutlined, DollarCircleOutlined } from "@ant-design/icons"; // Import icons
import { Card, Col, Row, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import orderApi from "../../../api/orderApi";
import productApi from "../../../api/productApi";
import formatPrice from "../../../utils/formatPrice";

const Dashboard = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [ordersPerMonth, setOrdersPerMonth] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalCashOrders, setTotalCashOrders] = useState(0);
  const [totalVnPayOrders, setTotalVnPayOrders] = useState(0);

  const CUSTOM_COLORS = ["#FF6B6B", "#4ECDC4", "#1A535C", "#FFE66D", "#FF924C"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productRes = await productApi.getProducts({
        sortBy: "view",
        limit: 5,
      });
      setBestProducts(productRes.data);

      // Fetching orders per month
      const orderRes = await orderApi.getOrders();
      const ordersByMonth = calculateOrdersPerMonth(orderRes.data);
      setOrdersPerMonth(ordersByMonth);

      // Fetching total sales
      const totalSales = calculateTotalSales(orderRes.data);
      setTotalSales(totalSales);

      // Fetching recent orders
      const recentOrdersRes = await orderApi.getOrders();
      setRecentOrders(recentOrdersRes.data); // Displaying top 5 recent orders

      const cashOrders = await fetchCashOrders(orderRes.data);
      setTotalCashOrders(cashOrders);

      const vnPayOrders = await fetchVnPayOrders(orderRes.data);
      setTotalVnPayOrders(vnPayOrders);
    } catch (error) {
      message.error("Failed to fetch dashboard data");
      console.error(error);
    }
  };

  const limitedProducts = bestProducts.slice(0, 5);

  // Utility functions
  const calculateTotalSales = (orders) => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  const calculateOrdersPerMonth = (orders) => {
    const ordersByMonth = [];
    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      if (!ordersByMonth[month]) {
        ordersByMonth[month] = { month: month + 1, orders: 0 };
      }
      ordersByMonth[month].orders += 1;
    });
    return ordersByMonth.filter(Boolean); // Filter out undefined months
  };

  const fetchCashOrders = (orders) => {
    return orders.filter((order) => order.paymentMethod === "COD").length;
  };

  const fetchVnPayOrders = (orders) => {
    return orders.filter((order) => order.paymentMethod === "VNPAY").length;
  };

  // Table columns for recent orders
  const columns = [
    {
      title: "Order Num",
      dataIndex: "order_number",
      render: (_, __, index) => ++index,
    },
    { title: "User", dataIndex: "customerName", key: "customerName" },
    { title: "Phone", dataIndex: "customerPhone", key: "customerPhone" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Note", dataIndex: "message", key: "message" },
    {
      title: "Total Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => formatPrice(text),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
  ];

  return (
    <div className="dashboard-page">
      <Row gutter={16}>
        <Col span={5}>
          <Card
            title={
              <span className="font-semibold text-gray-800">Total Sales</span>
            }
            bordered={false}
            className="shadow-lg rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white"
          >
            <h2 className="font-bold text-red-600">
              {formatPrice(totalSales)}
            </h2>
          </Card>
          <Card
            title={
              <span className="font-semibold text-gray-800">
                Total Orders (VNPay)
              </span>
            }
            bordered={false}
            className="shadow-lg mt-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white"
          >
            <div className="flex items-center">
              <CreditCardOutlined className="text-2xl mr-2" />
              <h3 className="font-bold text-red-600">{totalVnPayOrders}</h3>
            </div>
          </Card>
          <Card
            title={
              <span className="font-semibold text-gray-800">
                Total Orders (COD)
              </span>
            }
            bordered={false}
            className="shadow-lg mt-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white"
          >
            <div className="flex items-center">
              <DollarCircleOutlined className="text-2xl mr-2" />
              <h3 className="font-bold text-red-600">{totalCashOrders}</h3>
            </div>
          </Card>
        </Col>

        {/* Orders Per Month (Bar Chart) */}
        <Col span={12}>
          <Card
            title={
              <span className="text-lg font-semibold">Orders Per Month</span>
            }
            bordered={false}
            className="shadow-lg rounded-lg"
          >
            <BarChart width={450} height={300} data={ordersPerMonth}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  borderColor: "#E5E7EB",
                }}
                itemStyle={{ color: "#1F2937" }}
                cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
              />
              <Bar
                dataKey="orders"
                fill="url(#colorOrders)"
                radius={[10, 10, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </Card>
        </Col>

        {/* Best Products By Views */}
        <Col span={7}>
          <Card
            title={
              <span className="text-lg font-semibold">
                Best Products by Views
              </span>
            }
            bordered={false}
            className="shadow-lg rounded-lg"
            style={{ width: 300, height: 400 }}
          >
            <ul className="space-y-2">
              {limitedProducts
                .sort((a, b) => b.view - a.view) // Sort products by view in descending order
                .map((product, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <span className="text-gray-700 font-medium">
                      {product.name}
                    </span>
                    <span
                      className="text-white text-sm px-3 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          CUSTOM_COLORS[index % CUSTOM_COLORS.length],
                      }}
                    >
                      {(
                        (product.view /
                          bestProducts.reduce((sum, p) => sum + p.view, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </li>
                ))}
            </ul>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className="mt-6">
        <Col span={24}>
          <Card title="Recent Orders" bordered={false}>
            <Table
              columns={columns}
              dataSource={recentOrders}
              rowKey="order_number"
              pagination={recentOrders.length > 5 ? { pageSize: 5 } : false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
