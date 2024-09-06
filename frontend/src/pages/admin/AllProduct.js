import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";
import AdminProductCard from "../../components/admin/AdminProductCard";
import UploadProduct from "../../components/user/UploadProduct";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    console.log("product data", dataResponse);

    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  // Calculate the number of pages
  const totalPages = Math.ceil(allProduct.length / productsPerPage);

  // Get current products based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className=" min-h-screen p-4">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg py-3 px-10 flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl text-gray-800">All Products</h2>
        <button
          className="bg-green-300 text-dark hover:bg-gradient-to-l hover:bg-yellow-300 transition-all py-2 px-5 rounded-full shadow-md"
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/**all product */}
      <div className="bg-slate-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3 h-[calc(100vh-70px)] overflow-y-scroll">
        {currentProducts.length > 0 ? (
          currentProducts.map((product, index) => {
            return (
              <AdminProductCard
                data={product}
                key={index + "allProduct"}
                fetchdata={fetchAllProduct}
              />
            );
          })
        ) : (
          <div className="text-center text-white text-lg">
            No products found.
          </div>
        )}
      </div>

      {/** Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`mx-2 px-4 py-2 rounded-full shadow-md ${
                currentPage === index + 1
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/**upload product component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
