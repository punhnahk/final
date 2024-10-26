import classNames from "classnames";
import React from "react";

const WrapperContent = ({ children, className }) => {
  return (
    <div
      className={classNames("w-[1200px] mx-auto max-w-full px-3 ", className)}
    >
      {children}
    </div>
  );
};

export default WrapperContent;
