import { message } from "antd";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";

const CategoriesList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await categoryApi.getCategories();
      setData(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  // Carousel responsive settings
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <WrapperContent className="pb-4">
      <Carousel
        removeArrowOnDeviceType={["tablet", "mobile"]}
        autoPlay={true}
        autoPlaySpeed={2000}
        responsive={responsive}
        arrows={true}
        infinite={true}
        className="bg-white rounded-lg shadow-md"
        itemClass="carousel-item-padding-10-px" // Reduced padding between items
      >
        {data.length > 0 &&
          data.map((it) => (
            <Link
              key={`category-item-${it._id}`}
              className="flex flex-col group gap-2 px-3 py-4 rounded-lg justify-center items-center hover:bg-gray-50 transition-all"
              to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${it._id}`}
            >
              <img
                src={it.image}
                loading="lazy"
                alt="Category img"
                className="h-[80px] w-full object-contain group-hover:scale-105 transition-transform duration-300" // Reduced image size
              />
              <p className="font-medium text-center text-xs md:text-sm text-gray-800 transition-all">
                {" "}
                {it.name}
              </p>
            </Link>
          ))}
      </Carousel>
    </WrapperContent>
  );
};

export default CategoriesList;
