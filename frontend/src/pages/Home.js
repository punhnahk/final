import React from "react";
import BannerProduct from "../components/user/BannerProduct";
import CategoryList from "../components/user/CategoryList";
import VerticalCardProduct from "../components/user/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      {/* <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"} /> */}
      <VerticalCardProduct category={"airpodes"} heading={"Airpodes"} />
      <VerticalCardProduct category={"phone"} heading={"Smart Phone"} />
      <VerticalCardProduct category={"laptop"} heading={"Laptop"} />
      <VerticalCardProduct category={"earphones"} heading={"Earphones"} />
    </div>
  );
};

export default Home;
