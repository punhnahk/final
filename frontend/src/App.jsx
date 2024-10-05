import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
import { ROUTE_PATH } from "./constants/routes";
import AccountLayout from "./layouts/AccountLayout/AccountLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AppLayout from "./layouts/AppLayout";
import ClientLayout from "./layouts/ClientLayout/ClientLayout";
import AddCategory from "./pages/Admin/CategoryManagement/AddCategory";
import CategoryList from "./pages/Admin/CategoryManagement/CategoryList";
import EditCategory from "./pages/Admin/CategoryManagement/EditCategory";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AddNewsCategory from "./pages/Admin/NewsCategoryManagement/AddCategory";
import EditNewsCategory from "./pages/Admin/NewsCategoryManagement/EditCategory";
import NewsCategoryList from "./pages/Admin/NewsCategoryManagement/NewsCategoryList";
import AddNews from "./pages/Admin/NewsManagement/AddNews";
import EditNews from "./pages/Admin/NewsManagement/EditNews";
import NewsList from "./pages/Admin/NewsManagement/NewsList";
import OrderDetail from "./pages/Admin/OrderManagement/OrderDetail";
import OrderList from "./pages/Admin/OrderManagement/OrderList";
import AddProduct from "./pages/Admin/ProductManagement/AddProduct";
import EditProduct from "./pages/Admin/ProductManagement/EditProduct";
import ProductList from "./pages/Admin/ProductManagement/ProductList";
import AddSlider from "./pages/Admin/SliderManagement/AddSlider";
import EditSlider from "./pages/Admin/SliderManagement/EditSlider";
import SliderList from "./pages/Admin/SliderManagement/SliderList";
import EditUser from "./pages/Admin/UserManagement/EditUser";
import UserList from "./pages/Admin/UserManagement/UserList";
import Overview from "./pages/Client/About/Overview";
import PaymentGuide from "./pages/Client/About/PaymentGuide";
import ChangePassword from "./pages/Client/Account/ChangePassword/ChangePassword";
import OrderHistory from "./pages/Client/Account/OrderHistory/OrderHistory";
import OrderHistoryDetail from "./pages/Client/Account/OrderHistoryDetail/OrderHistoryDetail";
import UpdateInformation from "./pages/Client/Account/UpdateInformation/UpdateInformation";
import Cart from "./pages/Client/Cart/Cart";
import Checkout from "./pages/Client/Cart/Checkout";
import OrderSuccess from "./pages/Client/Cart/OrderSuccess";
import ForgotPassword from "./pages/Client/ForgotPassword/ForgotPassword";
import HomePage from "./pages/Client/Home/HomePage";
import ProductDetail from "./pages/Client/ProductDetail/ProductDetail";
import ClientProductList from "./pages/Client/Products/ProductList";
import SignIn from "./pages/Client/SignIn/SignIn";
import SignUp from "./pages/Client/SignUp/SignUp";
import VNPayReturn from "./pages/Client/VNPayReturn/VNPayReturn";

const App = () => {
  const router = createBrowserRouter([
    {
      path: ROUTE_PATH.HOME,
      element: <AppLayout />,
      children: [
        {
          path: ROUTE_PATH.HOME,
          element: <ClientLayout />,
          children: [
            {
              path: ROUTE_PATH.HOME,
              element: <HomePage />,
            },
            {
              path: ROUTE_PATH.SIGN_IN,
              element: <SignIn />,
            },
            {
              path: ROUTE_PATH.SIGN_UP,
              element: <SignUp />,
            },
            {
              path: ROUTE_PATH.FORGOT_PASSWORD,
              element: <ForgotPassword />,
            },
            {
              path: ROUTE_PATH.PRODUCTS_LIST,
              element: <ClientProductList />,
            },
            {
              path: ROUTE_PATH.PRODUCT_DETAIL(":id"),
              element: <ProductDetail />,
            },
            {
              path: ROUTE_PATH.CART,
              element: <Cart />,
            },
            {
              path: ROUTE_PATH.CHECKOUT,
              element: <Checkout />,
            },
            {
              path: ROUTE_PATH.ORDER_SUCCESS,
              element: <OrderSuccess />,
            },
            {
              path: ROUTE_PATH.VNPAY_RETURN,
              element: <VNPayReturn />,
            },
            {
              path: ROUTE_PATH.OVERVIEW,
              element: <Overview />,
            },
            {
              path: ROUTE_PATH.PAYMENTGUIDE,
              element: <PaymentGuide />,
            },

            // account
            {
              path: ROUTE_PATH.ACCOUNT,
              element: (
                <PrivateRoutes>
                  <AccountLayout />
                </PrivateRoutes>
              ),
              children: [
                {
                  path: ROUTE_PATH.ACCOUNT,
                  element: <UpdateInformation />,
                },
                {
                  path: ROUTE_PATH.CHANGE_PASSWORD,
                  element: <ChangePassword />,
                },
                {
                  path: ROUTE_PATH.ORDERS_HISTORY,
                  element: <OrderHistory />,
                },
                {
                  path: ROUTE_PATH.ORDER_HISTORY_DETAIL(":id"),
                  element: <OrderHistoryDetail />,
                },
              ],
            },
          ],
        },
        {
          path: ROUTE_PATH.ADMIN,
          element: (
            <PrivateRoutes>
              <AdminLayout />
            </PrivateRoutes>
          ),
          children: [
            {
              path: ROUTE_PATH.ADMIN,
              element: <Dashboard />,
            },
            {
              path: ROUTE_PATH.USER_MANAGEMENT,
              element: <UserList />,
            },
            {
              path: ROUTE_PATH.EDIT_USER(":id"),
              element: <EditUser />,
            },

            // category
            {
              path: ROUTE_PATH.CATEGORY_MANAGEMENT,
              element: <CategoryList />,
            },
            {
              path: ROUTE_PATH.ADD_CATEGORY,
              element: <AddCategory />,
            },
            {
              path: ROUTE_PATH.EDIT_CATEGORY(":id"),
              element: <EditCategory />,
            },

            // slider
            {
              path: ROUTE_PATH.SLIDER_MANAGEMENT,
              element: <SliderList />,
            },
            {
              path: ROUTE_PATH.ADD_SLIDER,
              element: <AddSlider />,
            },
            {
              path: ROUTE_PATH.EDIT_SLIDER(":id"),
              element: <EditSlider />,
            },

            // news category
            {
              path: ROUTE_PATH.NEWS_CATEGORY_MANAGEMENT,
              element: <NewsCategoryList />,
            },
            {
              path: ROUTE_PATH.ADD_NEWS_CATEGORY,
              element: <AddNewsCategory />,
            },
            {
              path: ROUTE_PATH.EDIT_NEWS_CATEGORY(":id"),
              element: <EditNewsCategory />,
            },

            // news
            {
              path: ROUTE_PATH.NEWS_MANAGEMENT,
              element: <NewsList />,
            },
            {
              path: ROUTE_PATH.ADD_NEWS,
              element: <AddNews />,
            },
            {
              path: ROUTE_PATH.EDIT_NEWS(":id"),
              element: <EditNews />,
            },

            // products
            {
              path: ROUTE_PATH.PRODUCT_MANAGEMENT,
              element: <ProductList />,
            },
            {
              path: ROUTE_PATH.ADD_PRODUCT,
              element: <AddProduct />,
            },
            {
              path: ROUTE_PATH.EDIT_PRODUCT(":id"),
              element: <EditProduct />,
            },

            // orders
            {
              path: ROUTE_PATH.ORDER_MANAGEMENT,
              element: <OrderList />,
            },
            {
              path: ROUTE_PATH.ORDER_DETAIL(":id"),
              element: <OrderDetail />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
