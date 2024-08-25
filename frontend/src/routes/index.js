import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminPanel from "../pages/AdminPanel";
import AllProducts from "../pages/AllProduct";
import AllUsers from "../pages/AllUser";
import Cart from "../pages/Cart";
import CategoryProduct from "../pages/CategoryProduct";
import ConfirmEmail from "../pages/ConfirmEmail";
import ForgotPassowrd from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import SearchProduct from "../pages/SearchProduct";
import SignUp from "../pages/SignUp";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassowrd />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
        ],
      },
      {
        path: "confirm-email",
        element: <ConfirmEmail />,
        children: [
          {
            path: ":token",
            element: <ConfirmEmail />,
          },
        ],
      },
    ],
  },
]);

export default router;
