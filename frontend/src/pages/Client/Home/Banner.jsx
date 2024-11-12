import { Carousel, message } from "antd";
import axios from "axios";
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
            className="absolute w-full h-full object-cover top-0 right-0 bottom-0 left-0 rounded-md"
          />
        </Link>
      ))}
    </Carousel>
  );
};

// Ad Section Component
const AdSection = () => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.unsplash.com/photos/random?query=apple-brand&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
      );
      setAd(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch ad");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {ad && (
        <Link
          key={ad.id}
          to={ad.links.html}
          target="_blank"
          className="relative rounded-md overflow-hidden bg-gray-200"
        >
          <img
            src={ad.urls.regular}
            alt={ad.alt_description}
            className={`w-full h-[150px] object-cover md:h-[248px] lg:h-[248px] transition-opacity duration-500 ease-in-out ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setLoading(false)}
          />
        </Link>
      )}
    </div>
  );
};

const SmallImagesGrid = () => {
  const smallImages = [
    "https://laptopbaominh.com/wp-content/uploads/2015/08/banner-n04.jpg",
    "https://cdn.shopify.com/s/files/1/1409/9796/files/PlayTech_Banner1_e934ebb1-f177-49e6-a954-e4f58cfa7fcd_1200x1200.png?v=1719556356",
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mb-1">
      {smallImages.map((src, index) => (
        <div
          key={index}
          className="w-full h-[100px] md:h-[100px] lg:h-[150px] overflow-hidden rounded-md shadow-md"
        >
          <img
            src={src}
            alt={`small-img-${index}`}
            className="w-full h-full object-cover"
            style={{
              imageRendering: "auto", // Adjusts for higher-density screens
              transform: "scale(1)", // Slight upscale for sharper look
            }}
            loading="lazy" // Lazy loading for performance optimization
          />
        </div>
      ))}
    </div>
  );
};

const BannerWithAds = () => {
  return (
    <WrapperContent className="flex flex-col gap-4 py-3">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/5 ">
          <Banner />
        </div>
        <div className="w-full md:w-2/5 flex flex-col gap-4">
          <AdSection />
        </div>
      </div>
      <SmallImagesGrid />
    </WrapperContent>
  );
};

export default BannerWithAds;
