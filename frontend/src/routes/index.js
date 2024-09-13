import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminPanel from "../pages/admin/AdminPanel";
import AllProducts from "../pages/admin/AllProduct";
import AllUsers from "../pages/admin/AllUser";
import CategoryProduct from "../pages/admin/CategoryProduct";
import OtpConfirmation from "../pages/mail/OtpConfirmation";
import Cart from "../pages/user/Cart";
import ForgotPassowrd from "../pages/user/ForgotPassword";
import Home from "../pages/user/Home";
import ProductDetails from "../pages/user/ProductDetails";
import SearchProduct from "../pages/user/SearchProduct";
import SignUp from "../pages/user/SignUp";
import Login from "../pages/user/SingIn";
import UserPanel from "../pages/user/UserPanel";
import VerifyOTP from "../pages/user/VerifyOTP";
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
        path: "verify-otp-password",
        element: <VerifyOTP />,
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
        path: "/otp-confirmation",
        element: <OtpConfirmation />,
      },
      {
        path: "user-panel",
        element: <UserPanel />,
        children: [
          {
            path: "all-users",
            element: <UserPanel />,
          },
          {
            path: "all-products",
            element: <UserPanel />,
          },
        ],
      },
    ],
  },
]);

export default router;
