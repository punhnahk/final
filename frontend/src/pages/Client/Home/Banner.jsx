import { Carousel, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sliderApi from "../../../api/sliderApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";

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
    <Carousel arrows draggable autoplay effect="fade" className="h-full">
      {data.map((it) => (
        <Link
          className="relative pt-[35%] !block"
          key={`banner-item-${it._id}`}
          to={it.url}
          target="_blank"
        >
          <img
            src={it.image}
            alt={it.title}
            className="absolute w-full h-full object-cover top-0 right-0 bottom-0 left-0 rounded-lg"
          />
        </Link>
      ))}
    </Carousel>
  );
};

const BannerWithAds = () => {
  return (
    <WrapperContent className="flex flex-col gap-6 py-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-full">
          <Banner />
        </div>
      </div>
    </WrapperContent>
  );
};

export default BannerWithAds;
