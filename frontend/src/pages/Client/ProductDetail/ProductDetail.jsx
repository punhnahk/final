import { Breadcrumb, Carousel, Empty, message, Pagination, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  FaCartArrowDown,
  FaHeart,
  FaPhoneAlt,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import cartApi from "../../../api/cartApi";
import commentApi from "../../../api/commentApi";
import productApi from "../../../api/productApi";
import wishlistApi from "../../../api/wishlistApi";
import ProductItem from "../../../components/ProductItem/ProductItem";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { TOKEN_STORAGE_KEY } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";
import useProfile from "../../../hooks/useProfile";
import { getMyCarts } from "../../../store/cartSlice";
import formatPrice from "../../../utils/formatPrice";

const ProductDetail = () => {
  const [data, setData] = useState();
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [comments, setComments] = useState([]); // State for comments
  const [loadingComments, setLoadingComments] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [comparisonList, setComparisonList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { profile } = useProfile();

  useEffect(() => {
    id && fetchData(id);
    fetchWishlistStatus(id);
  }, [id]);

  const fetchWishlistStatus = async (itemId) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      console.log("No token found, user is not authenticated");
      return;
    }

    try {
      const response = await wishlistApi.getWishlist({
        headers: { Authorization: `Bearer ${token}` },
      });

      const isInWishlist =
        Array.isArray(response.data) &&
        response.data.some((item) => String(item._id) === String(itemId));
      setIsInWishlist(isInWishlist);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        message.error("Failed to fetch wishlist items");
      } else {
        console.error("Error fetching wishlist status:", error);
        setIsInWishlist(false);
      }
    }
  };

  const onAddProductToCart = () => {
    handleAddCart(() => {
      message.success("Added product to cart");
    });
  };

  const onPayNow = () => {
    if (!profile) {
      navigate(ROUTE_PATH.SIGN_IN);
    } else {
      handleAddCart(() => {
        navigate(ROUTE_PATH.CART);
      });
    }
  };

  const toggleWishlist = async () => {
    if (!profile) {
      navigate(ROUTE_PATH.SIGN_IN);
      return;
    }

    if (isInWishlist) {
      try {
        await wishlistApi.removeFromWishlist(id);
        setIsInWishlist(false);
        message.success("Removed product from wishlist");
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to remove product from wishlist"
        );
      }
    } else {
      try {
        await wishlistApi.addToWishlist({ productId: id });
        setIsInWishlist(true);
        message.success("Added product to wishlist");
      } catch (error) {
        message.error(
          error.response?.data?.message || "Failed to add product to wishlist"
        );
      }
    }
  };

  const handleAddCart = async (callback) => {
    if (!profile) {
      navigate(ROUTE_PATH.SIGN_IN);
      return;
    }
    try {
      await cartApi.addCart({ productId: id, quantity: 1 });
      await dispatch(getMyCarts()).unwrap();
      callback();
    } catch (error) {
      if (error?.response) {
        message.error(error.response.data.message);
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const fetchData = async (productId) => {
    try {
      const [product, relatedProductResponse] = await Promise.all([
        productApi.getProduct(productId),
        productApi.getRelatedProduct(productId),
      ]);
      setData(product.data);
      setRelatedProduct(relatedProductResponse.data);
      fetchComments(productId); // Fetch comments separately
    } catch (error) {
      message.error("Failed to fetch product data.");
    }
  };

  const fetchComments = async (productId) => {
    setLoadingComments(true);
    try {
      const commentsResponse = await commentApi.getCommentsByProductId(
        productId
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching comments:", error); // Log the error for debugging
    } finally {
      setLoadingComments(false);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    // Round the rating to the nearest 0.5 for displaying half stars
    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Check if there's a half star
    const emptyStars = 5 - fullStars - halfStars; // Remaining empty stars

    // Render full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    // Render half star if needed
    if (halfStars === 1) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    // Render empty stars
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-400" />);
    }

    return stars;
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0; // Avoid division by zero if no comments
    const totalRating = comments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    return (totalRating / comments.length).toFixed(1); // Average rating rounded to 1 decimal
  };

  const addToComparison = (product) => {
    const isProductInComparison = comparisonList.some((id) => product === id);

    if (isProductInComparison) {
      message.warning("This product is already in the comparison list.");
      return;
    }

    if (comparisonList.length < 3) {
      setComparisonList((prevList) => [...prevList, product]);
    } else {
      message.warning("You can compare up to 3 products.");
    }
  };

  const removeFromComparison = (productId) => {
    setComparisonList([]);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  if (!data) {
    return (
      <WrapperContent className="h-[300px] flex items-center justify-center">
        <Spin />
      </WrapperContent>
    );
  }

  return (
    <WrapperContent>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item>
          <Link className="text-[#1250dc] font-medium" to={ROUTE_PATH.HOME}>
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            className="text-[#1250dc] font-medium"
            to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${data.category._id}`}
          >
            {data.category.name}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="font-medium">{data.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid grid-cols-12 gap-4 mt-6 mb-8">
        {/* Image Carousel */}
        <div className="col-span-12 lg:col-span-6">
          <Carousel draggable arrows>
            {data.image.map((it, index) => (
              <div
                className="relative w-full h-[400px] overflow-hidden"
                key={`product-image-${index}`}
              >
                <img
                  src={it}
                  loading="lazy"
                  alt="Product"
                  className="object-contain w-full h-full rounded-lg transition-transform duration-300 ease-in-out transform"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Product Info */}
        <div className="col-span-12 lg:col-span-6">
          <p className="text-sm text-gray-500 mt-2">
            #{data.brand}_{data._id.slice(-5).toUpperCase()}
          </p>
          <h1 className="text-[#090d14] font-semibold text-2xl lg:text-3xl break-words">
            {data.name}
          </h1>

          {/* Star Rating */}
          <div className=" flex items-center gap-4">
            <div className="flex items-center gap-1">
              {/* Render Star Rating */}
              {renderStarRating(calculateAverageRating())}
            </div>
            <p className="text-sm text-[#6b7280]">
              ({comments.length} Reviews) - {calculateAverageRating()} Stars
            </p>
          </div>

          <p className="text-sm text-[#6b7280] font-medium">
            Category:
            <Link
              to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${data.category._id}`} // Using the category ID for routing
              className="font-semibold text-[#6b7280] pl-1" // Add padding-left
              aria-label={`${data.category.name}`} // Improved accessibility
            >
              {data.category.name}
            </Link>
          </p>
          <p className="text-sm text-[#6b7280] font-medium">
            Brand:{" "}
            <span className="font-semibold text-[#6b7280]">{data.brand}</span>
          </p>
          <img
            src="/images/ads.webp"
            alt="ads"
            className="block mt-3 rounded-xl"
          />

          <div className="mt-4 border border-[#fde68a] rounded-md p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#6b7280] font-medium">Buy now at</p>
                <p className="text-[#090d14] text-2xl lg:text-3xl font-bold mt-1">
                  {formatPrice(
                    data.salePrice > 0 ? data.salePrice : data.price
                  )}
                </p>
                {data.salePrice > 0 && (
                  <p className="text-[#6b7280] text-sm line-through font-medium">
                    {formatPrice(data.price)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => addToComparison(data)}
              className="w-14 h-14 flex justify-center items-center rounded-lg border border-[#dc2626] transition-colors duration-200 hover:bg-[#dc2626] hover:text-white cursor-pointer"
            >
              <GoGitCompare className="text-2xl text-blue-400" />
            </button>
            <button
              onClick={onAddProductToCart}
              className="w-14 h-14 flex justify-center items-center rounded-lg border border-[#dc2626] transition-colors duration-200 hover:bg-[#dc2626] hover:text-white cursor-pointer"
            >
              <FaCartArrowDown className="text-[#dc2626] text-2xl" />
            </button>
            <button
              onClick={toggleWishlist}
              className="w-14 h-14 flex justify-center items-center rounded-lg border transition-colors duration-200 hover:bg-[#f59e0b] hover:text-white cursor-pointer border-[#dc2626]"
            >
              {isInWishlist ? (
                <FaHeart className="text-2xl text-red-500" />
              ) : (
                <FaRegHeart className="text-2xl text-[#f59e0b]" />
              )}
            </button>
            <button
              onClick={onPayNow}
              className="flex-1 bg-[#dc2626] rounded-lg cursor-pointer text-white font-medium transition-transform duration-200 hover:scale-105"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            <FaPhoneAlt className="text-[#dc2626]" />
            <p>Call</p>
            <p className="font-semibold text-[#dc2626]"> 1800-1234 </p>
            <p>for purchase advice (Free)</p>
          </div>
        </div>
      </div>
      {comparisonList.length > 0 && (
        <div className="mt-8 mb-8">
          <h3 className="text-[#444] text-2xl text-left font-bold">
            Comparison List
          </h3>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border-b text-left">Product</th>
                  <th className="p-4 border-b text-center">Image</th>
                  <th className="p-4 border-b text-left">Brand</th>
                  <th className="p-4 border-b text-center">Price</th>
                  <th className="p-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {comparisonList.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-lg font-medium">{product.name}</td>
                    <td>
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="object-contain w-[100px] h-[100px] mx-auto items-start"
                      />
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.brand}
                    </td>
                    <td className="p-4 text-lg text-center font-semibold text-green-600">
                      {formatPrice(
                        product.salePrice > 0
                          ? product.salePrice
                          : product.price
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => removeFromComparison(id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Description */}
      <div className="mb-6">
        <p className="font-bold text-2xl text-[#444]">Product Information</p>
        <div className="p-3 rounded-lg mt-2 shadow-lg bg-white">
          <div
            className="text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      </div>

      {/* Related News */}
      <div className="mb-6">
        <p className="font-bold text-2xl text-[#444]">Related News</p>
        <div className="p-3 rounded-lg mt-2 shadow-lg">
          {data.posts.length > 0 ? (
            data.posts.map((post, index) => (
              <div key={`post-${index}`} className="mb-4">
                <h3 className="font-semibold text-3xl text-center">
                  {post.title}
                </h3>{" "}
                <br />
                {post.thumbnail && (
                  <div className="mb-3 flex justify-center">
                    {" "}
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-3/4 h-auto rounded-lg"
                    />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            ))
          ) : (
            <Empty description="No related news available" />
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mb-2 pt-4 pb-6 lg:pb-8">
        <p className="font-bold text-xl text-[#444]">Similar Products</p>
        <div className="mt-2 overflow-x-auto flex lg:justify-start md:justify-center sm:justify-center space-x-2">
          {relatedProduct.slice(0, 4).map((it) => (
            <ProductItem
              key={`related-product-${it._id}`}
              data={it}
              className="flex-none w-[60%] sm:w-[45%] md:w-[25%] lg:w-[23%] shadow-md mb-2"
            />
          ))}
        </div>

        {!relatedProduct.length && (
          <Empty className="mt-3" description="No related products available" />
        )}
      </div>

      <div className="mb-6">
        <p className="font-bold text-2xl text-[#444]">Customer Feedback</p>
        <div className="p-3 rounded-lg mt-2 shadow-lg">
          {loadingComments ? (
            <Spin />
          ) : currentComments.length > 0 ? (
            currentComments.map((comment, index) => (
              <div
                key={`comment-${index}`}
                className="border-b py-2 flex gap-4"
              >
                {/* User Avatar */}
                <img
                  src={
                    comment.userId?.avatar ||
                    "https://icons.veryicon.com/png/o/miscellaneous/common-icons-31/default-avatar-2.png"
                  }
                  loading="lazy"
                  alt={`${comment.userId?.name || "User"}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  {/* User Name */}
                  <p className="font-semibold">
                    {comment.userId?.name || "User"}
                  </p>
                  {/* Rating Display */}
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, starIndex) => {
                      // Determine if it's a full, half, or empty star
                      const isFullStar = starIndex < Math.floor(comment.rating);
                      const isHalfStar =
                        starIndex === Math.floor(comment.rating) &&
                        comment.rating % 1 !== 0;

                      return (
                        <span
                          key={starIndex}
                          className={`text-xl ${
                            isFullStar
                              ? "text-yellow-500"
                              : isHalfStar
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          {isFullStar ? "★" : isHalfStar ? "☆" : "☆"}
                        </span>
                      );
                    })}
                  </div>
                  {/* Comment Content */}
                  <p className="text-gray-700">{comment.content}</p>
                  {/* Comment Timestamp */}
                  <p className="text-gray-500 text-sm">
                    Commented on: {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <Empty description="No customer feedback available" />
          )}
        </div>
        {/* Pagination */}
        <Pagination
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          total={comments.length}
          pageSize={commentsPerPage}
          className="mt-4 justify-end"
        />
      </div>
    </WrapperContent>
  );
};

export default ProductDetail;
