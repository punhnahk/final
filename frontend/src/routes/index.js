import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminPanel from "../pages/AdminPanel";
import AllProduct from "../pages/AllProduct";
import AllUser from "../pages/AllUser";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUser />,
          },
          {
            path: "all-products",
            element: <AllProduct />,
          },
        ],
      },
      {},
    ],
  },
]);

export default router;
