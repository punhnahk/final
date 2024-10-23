import { Card, Col, Row, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import orderApi from "../../../api/orderApi";
import productApi from "../../../api/productApi";
import formatPrice from "../../../utils/formatPrice";

const Dashboard = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [ordersPerMonth, setOrdersPerMonth] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [cityDistribution, setCityDistribution] = useState([]); // State for city distribution

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

      // Fetch city distribution
      const cityDist = await fetchCityDistribution(orderRes.data);
      setCityDistribution(cityDist);
    } catch (error) {
      message.error("Failed to fetch dashboard data");
      console.error(error);
    }
  };

  const limitedProducts = bestProducts.slice(0, 5);

  const calculateTotalSales = (orders) => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  const calculateOrdersPerMonth = (orders) => {
    const ordersByMonth = [];
    orders.forEach((order) => {
      if (order.status !== "canceled") {
        const month = new Date(order.createdAt).getMonth();
        if (!ordersByMonth[month]) {
          ordersByMonth[month] = { month: month + 1, orders: 0 };
        }
        ordersByMonth[month].orders += 1;
      }
    });
    return ordersByMonth.filter(Boolean);
  };

  const fetchCashOrders = (orders) => {
    return orders.filter((order) => order.paymentMethod === "COD").length;
  };

  const fetchVnPayOrders = (orders) => {
    return orders.filter((order) => order.paymentMethod === "VNPAY").length;
  };

  // Function to fetch city distribution
  const fetchCityDistribution = (orders) => {
    const cityCount = {};
    orders.forEach((order) => {
      const addressParts = order.address.split(",").map((part) => part.trim());
      if (addressParts.length > 1) {
        const city = addressParts[addressParts.length - 1]; // Get the last part as the city
        cityCount[city] = (cityCount[city] || 0) + 1;
      }
    });
    return Object.entries(cityCount).map(([city, count]) => ({
      name: city,
      value: count,
    }));
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "INITIAL":
        return "text-gray-400"; // Gray for initial status
      case "CONFIRMED":
        return "text-blue-600"; // Blue for confirmed status
      case "DELIVERING":
        return "text-orange-600"; // Orange for delivering status
      case "DELIVERED":
        return "text-green-600"; // Green for delivered status
      case "CANCELED":
        return "text-red-600"; // Red for canceled status
      default:
        return "text-gray-500"; // Default gray color for other statuses
    }
  };

  // Table columns for recent orders
  const columns = [
    {
      title: <div className="text-center">Order Num</div>,
      dataIndex: "order_number",
      render: (_, __, index) => ++index,
    },
    {
      title: <div className="text-center">User</div>,
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: <div className="text-center">Phone</div>,
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: <div className="text-center">Address</div>,
      dataIndex: "address",
      key: "address",
    },
    {
      title: <div className="text-center">Note</div>,
      dataIndex: "message",
      key: "message",
    },
    {
      title: <div className="text-center">Total Amount</div>,
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => formatPrice(text),
    },
    {
      title: <div className="text-center">Status</div>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`font-semibold ${getStatusColor(status)}`}>
          {status}
        </span>
      ),
    },
    {
      title: <div className="text-center">Payment</div>,
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
            className="shadow-lg rounded-lg bg-green-300 text-white"
          >
            <h2 className="font-bold text-red-600 text-lg">
              {formatPrice(totalSales)}
            </h2>
          </Card>
        </Col>

        {/* Orders Per Month (Bar Chart) */}
        <Col span={11.9}>
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
                  <stop offset="5%" stopColor="#C9E9D2" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8ABFA3" stopOpacity={0.8} />
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
        <Col span={6}>
          <Card
            title={
              <span className="text-lg font-semibold text-black">
                Best Products by Views
              </span>
            }
            bordered={false}
            className="shadow-lg rounded-lg bg-emerald-300"
            style={{ width: 300, height: 400 }} // Adjust height for better fit
          >
            <div className="grid grid-cols-1 gap-2">
              {limitedProducts
                .sort((a, b) => b.view - a.view)
                .slice(0, 5) // Only take the top three products
                .map((product) => (
                  <div
                    key={product._id}
                    className="flex justify-between items-center bg-white text-black rounded-lg p-2 pr-3 shadow-md"
                  >
                    <span className="flex-grow pr-4 ">{product.name}</span>
                    <span className="font-bold text-red-500 text-lg flex-shrink-0">
                      {product.view}
                      <span className="text-gray-500 text-sm"> views</span>
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card title="Recent Orders" className="mt-4">
        <Table
          columns={columns}
          dataSource={recentOrders.slice(0, 4)}
          pagination={false}
        />
      </Card>

      {/* City Distribution Card */}
      <Card
        title="City Distribution"
        className="mt-4 shadow-lg rounded-lg bg-white"
        bordered={false}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Pie Chart */}
          <PieChart width={600} height={300} className="">
            <Pie
              data={cityDistribution}
              cx={400}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              dataKey="value"
            >
              {cityDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CUSTOM_COLORS[index % CUSTOM_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          {/* City Details */}
          <div className="ml-0 md:ml-8 mb-56 md:mt-0">
            <h3 className="text-gray-800 text-lg font-medium mb-2">
              City Order Counts
            </h3>
            <ul className="list-none">
              {cityDistribution.map((city, index) => (
                <li key={index} className="text-gray-600 mb-1">
                  <span className="font-semibold">{city.name}</span>:{" "}
                  <span>{city.value} orders</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
