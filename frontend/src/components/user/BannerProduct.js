import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import banner1 from "../../assest/banner/banner 1.jpg";
import banner2 from "../../assest/banner/banner 2.jpg";
import banner3 from "../../assest/banner/banner 3.jpg";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [banner1, banner2, banner3];

  const mobileImages = [
    "https://example.com/vietnam-mobile-image1.jpg",
    "https://example.com/vietnam-mobile-image2.jpg",
    "https://example.com/vietnam-mobile-image3.jpg",
    "https://example.com/vietnam-mobile-image4.jpg",
    "https://example.com/vietnam-mobile-image5.jpg",
  ];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === desktopImages.length - 1 ? 0 : prev + 1
    );
  };

  const preveImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? desktopImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-48 md:h-96 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        <div className="absolute inset-0 flex justify-between items-center px-4 z-10">
          <button
            onClick={preveImage}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
            aria-label="Previous image"
          >
            <FaAngleLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
            aria-label="Next image"
          >
            <FaAngleRight size={24} />
          </button>
        </div>

        {/** Desktop and tablet version */}
        <div className="hidden md:flex h-full w-full">
          {desktopImages.map((imageURL, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={imageURL}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/** Mobile version */}
        <div className="flex md:hidden h-full w-full">
          {mobileImages.map((imageURL, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={imageURL}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
