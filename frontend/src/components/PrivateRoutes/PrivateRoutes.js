import React from "react";
import { TOKEN_STORAGE_KEY } from "../../constants";
import { Navigate } from "react-router-dom";
import { ROUTE_PATH } from "../../constants/routes";

const PrivateRoutes = ({ children }) => {
  const isAuthenticate = localStorage.getItem(TOKEN_STORAGE_KEY);

  return isAuthenticate ? children : <Navigate to={ROUTE_PATH.SIGN_IN} />;
};

export default PrivateRoutes;
