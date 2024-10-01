import React from "react";
import Banner from "./Banner";
import CategoriesList from "./CategoriesList";
import ProductsList from "./ProductsList";

const HomePage = () => {
  return (
    <div className="bg-[#f3f4f6]">
      <Banner />
      <CategoriesList />
      <ProductsList />
    </div>
  );
};

export default HomePage;
