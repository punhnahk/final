import { Card, Carousel, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import sliderApi from "../../../api/sliderApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import formatPrice from "../../../utils/formatPrice";

// Banner Component
const Banner = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await sliderApi.getSliders();
      setData(res.data);
    } catch (error) {
      message.error("Failed to fetch banners");
    }
  };

  return (
    <Carousel
      arrows
      draggable
      autoplay
      effect="fade"
      className="h-[120px] sm:h-[200px] md:h-[230px] rounded-lg"
    >
      {data.map((it) => (
        <Link
          className="relative pt-[32%] !block"
          key={`banner-item-${it._id}`}
          to={it.url}
          target="_blank"
        >
          <img
            src={it.image}
            alt={it.title}
            className="absolute w-full h-full object-fill top-0 right-0 bottom-0 left-0 rounded-lg"
          />
        </Link>
      ))}
    </Carousel>
  );
};

// Hot Sale Product Component for a list of products
const HotSaleProductList = ({ products }) => {
  const limitedProducts = products.slice(0, 3); // Only show the first 3 products
  return (
    <Card
      title={<span className="text-xl font-bold pl-32">Hot Sale Products</span>}
      bordered={false}
      style={{ width: "100%", height: "auto" }}
      className="bg-red-200"
    >
      <Carousel
        dots={false}
        autoplay={true}
        effect="fade"
        className="h-[120px] md:h-[122px] rounded-lg"
      >
        {limitedProducts.map((product) => {
          const discountPercentage =
            product.price > 0
              ? ((product.price - product.salePrice) / product.price) * 100
              : 0;

          return (
            <div key={product._id}>
              <div className="flex justify-between items-center text-black rounded-lg p-1">
                <img
                  src={product.image[0]} // Assuming product has image array
                  alt={product.name}
                  className="w-50 h-[100px] object-cover rounded-lg mb-3"
                />
                <div className="flex-grow overflow-hidden text-ellipsis flex-wrap text-center">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex justify-center gap-2 items-center mb-2">
                    {/* Format the sale price using formatPrice */}
                    <p className="text-lg text-red-600 font-semibold">
                      Sale: {formatPrice(product.salePrice)}
                    </p>
                    {/* Calculate and display discount percentage */}
                    <p className="text-xs text-green-500 font-semibold">
                      ({discountPercentage.toFixed(2)}% OFF)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </Card>
  );
};

const BannerWithAds = () => {
  const [bestSaleProducts, setBestSaleProducts] = useState([]);

  useEffect(() => {
    fetchBestSaleProducts();
  }, []);

  const fetchBestSaleProducts = async () => {
    try {
      const res = await productApi.getProducts();
      setBestSaleProducts(res.data);
    } catch (error) {
      message.error("Failed to fetch hot sale products");
    }
  };

  return (
    <WrapperContent className="flex flex-col gap-6 py-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Banner section */}
        <div className="w-full md:w-3/5">
          <Banner className="h-[150px] sm:h-[250px] md:h-[300px] rounded-lg" />
        </div>

        {/* Hot Sale Product List section */}
        <div className="w-full md:w-[38%]">
          {bestSaleProducts.length > 0 ? (
            <HotSaleProductList
              className="h-[150px] sm:h-[250px] md:h-[300px] rounded-lg"
              products={bestSaleProducts.slice(0, 3)}
            />
          ) : (
            <p>Loading hot sale products...</p>
          )}
        </div>
      </div>
    </WrapperContent>
  );
};

export default BannerWithAds;
