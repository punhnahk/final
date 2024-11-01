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
  const [loading, setLoading] = useState(true); // State to track loading
  useEffect(() => {
    fetchAd(); // Fetch a new ad once on component mount
  }, []);

  const fetchAd = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const res = await axios.get(
        `https://api.unsplash.com/photos/random?query=technology&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
      );
      setAd(res.data); // Set the single ad
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
            src={ad.urls.regular} // Use a specific size for consistent dimensions
            alt={ad.alt_description}
            className={`w-full h-[150px] object-cover md:h-[248px] lg:h-[248px] transition-opacity duration-500 ease-in-out ${
              loading ? "opacity-0" : "opacity-100"
            }`} // Add transition effect
            onLoad={() => setLoading(false)} // Remove loading state on image load
          />
        </Link>
      )}
    </div>
  );
};

// Main Component combining Banner and AdSection
const BannerWithAds = () => {
  return (
    <WrapperContent className="flex flex-col md:flex-row gap-4 py-3">
      <div className="w-full md:w-3/5">
        <Banner />
      </div>
      <div className="w-full md:w-2/5 flex flex-col gap-4">
        <AdSection />
      </div>
    </WrapperContent>
  );
};

export default BannerWithAds;
