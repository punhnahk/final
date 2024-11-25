import { Card, Carousel, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import sliderApi from "../../../api/sliderApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";
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
const HotSaleProductList = ({ products }) => {
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    const getRandomProducts = () => {
      const shuffledProducts = [...products];
      for (let i = shuffledProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledProducts[i], shuffledProducts[j]] = [
          shuffledProducts[j],
          shuffledProducts[i],
        ];
      }
      return shuffledProducts;
    };
    setRandomProducts(getRandomProducts());

    const intervalId = setInterval(() => {
      setRandomProducts(getRandomProducts());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [products]);

  return (
    <Card
      title={<span className="text-xl font-bold pl-28">Shop's Best Picks</span>}
      bordered={false}
      style={{ width: "100%", height: "auto" }}
      className="bg-white"
    >
      <Carousel
        dots={false}
        autoplay={true}
        autoplayInterval={60000}
        effect="fade"
        className="h-[120px] md:h-[122px] rounded-lg"
      >
        {randomProducts.map((product) => {
          return (
            <div key={product._id}>
              <Link to={ROUTE_PATH.PRODUCT_DETAIL(product._id)}>
                <div className="flex justify-between items-center text-black rounded-lg p-1">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-55 h-[100px] object-cover rounded-lg mb-3"
                  />

                  <div className="flex-grow overflow-hidden text-ellipsis flex-wrap text-center">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="flex justify-center gap-2 items-center mb-2">
                      <p className="text-lg text-red-600 font-semibold">
                        Price: {formatPrice(product.salePrice)}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
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
          <HotSaleProductList
            className="h-[150px] sm:h-[250px] md:h-[300px] rounded-lg"
            products={bestSaleProducts}
          />
        </div>
      </div>
    </WrapperContent>
  );
};

export default BannerWithAds;
