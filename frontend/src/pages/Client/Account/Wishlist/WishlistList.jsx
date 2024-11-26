import { DeleteOutlined } from "@ant-design/icons"; // Import icon
import { Button, message, Pagination, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import wishlistApi from "../../../../api/wishlistApi";
import WrapperContent from "../../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../../constants/routes";
import formatPrice from "../../../../utils/formatPrice";

const { Title } = Typography;

const WishlistList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items per page

  // Function to fetch wishlist items
  const fetchWishlist = async () => {
    setLoading(true); // Start loading
    try {
      const response = await wishlistApi.getWishlist();
      console.log("Fetched wishlist items:", response.data);
      setWishlistItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error("Failed to fetch wishlist items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist(); // Fetch wishlist on component mount
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistApi.removeFromWishlist(productId); // Send productId directly
      message.success("Item removed from wishlist");
      fetchWishlist(); // Refresh wishlist after removal
    } catch (error) {
      message.error("Failed to remove item from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" /> {/* Show a spinner while loading */}
      </div>
    );
  }

  // Calculate paginated items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlistItems.slice(indexOfFirstItem, indexOfLastItem); // Get items for the current page

  return (
    <WrapperContent className="my-8 px-4">
      <Title level={2} className="text-center my-4">
        Your Wishlist
      </Title>
      <div className="space-y-4">
        {currentItems.map((item) => {
          const images = item?.image || [];
          return (
            <div className="relative">
              <Link
                to={ROUTE_PATH.PRODUCT_DETAIL(item._id)}
                key={item._id}
                className="flex items-center bg-white rounded-lg shadow-sm border-red-50 border-2 p-4 space-x-6 transition-transform transform hover:shadow-lg hover:bg-red-100 mb-2"
              >
                <div className="flex-shrink-0">
                  {images.length > 0 ? (
                    <img
                      alt={item.name}
                      src={images[0]}
                      className="object-cover w-16 h-16 rounded-md"
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 break-words">
                    {item?.name || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.salePrice)}
                  </p>
                </div>
              </Link>

              {/* Nút xóa */}
              <div className="absolute top-2 right-2">
                <Button
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item._id);
                  }}
                  icon={<DeleteOutlined className="text-gray-600" />}
                  className="p-0"
                />
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        current={currentPage} // Current page
        pageSize={itemsPerPage} // Items per page
        total={wishlistItems.length} // Total items
        onChange={(page) => setCurrentPage(page)} // Update current page
        className="flex justify-center my-4" // Center pagination
      />
    </WrapperContent>
  );
};

export default WishlistList;
