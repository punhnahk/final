import React, { useEffect, useState } from "react";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { Carousel, message } from "antd";
import { Link } from "react-router-dom";
import sliderApi from "../../../api/sliderApi";

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
      message.error("Failed to fetch");
    }
  };

  return (
    <WrapperContent className="py-3">
      <Carousel arrows draggable autoplay effect="fade">
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
              className="absolute w-full h-full object-cover top-0 right-0 bottom-0 left-0 rounded-md"
            />
          </Link>
        ))}
      </Carousel>
    </WrapperContent>
  );
};

export default Banner;
