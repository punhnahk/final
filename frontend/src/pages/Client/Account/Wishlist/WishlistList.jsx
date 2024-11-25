import {
  Button,
  Card,
  List,
  message,
  Pagination,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
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
      <List
        grid={{
          gutter: 16,
          xs: 1, // 1 column on extra small screens
          sm: 2, // 2 columns on small screens
          md: 3, // 3 columns on medium screens
          lg: 4, // 4 columns on large screens
          xl: 5, // 5 columns on extra large screens
        }}
        dataSource={currentItems} // Ensure dataSource is always an array
        renderItem={(item) => {
          const images = item?.image || []; // Fallback to an empty array

          return (
            <List.Item>
              <Link to={ROUTE_PATH.PRODUCT_DETAIL(item._id)}>
                {/* Use Link to navigate to product details */}
                <Card
                  hoverable
                  className="shadow-lg rounded-lg transition-transform transform"
                >
                  <Card.Meta
                    title={item?.name || "Unnamed Product"}
                    description={formatPrice(item.salePrice)}
                  />
                  <div className="flex justify-center items-center mt-2">
                    {/* Display product image horizontally */}
                    {images.length > 0 ? (
                      <img
                        alt={item.name}
                        src={images[0]} // Use the first image
                        className="object-cover w-full" // Make the image width 100% of the card
                        style={{
                          maxWidth: "100%", // Ensure the image fits within the card
                          maxHeight: "120px", // Limit the image height to fit horizontally
                          objectFit: "contain", // Preserve aspect ratio
                        }}
                      />
                    ) : (
                      <div className="h-48 w-full flex items-center justify-center bg-gray-200">
                        <span>No Image Available</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
              <div className="flex justify-center pt-2">
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item._id);
                  }}
                  className="w-full sm:w-auto" // Make button full width on small screens
                >
                  Remove
                </Button>
              </div>
            </List.Item>
          );
        }}
      />
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
