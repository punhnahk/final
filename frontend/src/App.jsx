import React, { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
import { ROUTE_PATH } from "./constants/routes";
import AccountLayout from "./layouts/AccountLayout/AccountLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AppLayout from "./layouts/AppLayout";
import ClientLayout from "./layouts/ClientLayout/ClientLayout";

// Lazy load pages
const HomePage = lazy(() => import("./pages/Client/Home/HomePage"));
const SignIn = lazy(() => import("./pages/Client/SignIn/SignIn"));
const SignUp = lazy(() => import("./pages/Client/SignUp/SignUp"));
const ForgotPassword = lazy(() =>
  import("./pages/Client/ForgotPassword/ForgotPassword")
);
const ClientProductList = lazy(() =>
  import("./pages/Client/Products/ProductList")
);
const ProductDetail = lazy(() =>
  import("./pages/Client/ProductDetail/ProductDetail")
);
const Cart = lazy(() => import("./pages/Client/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Client/Cart/Checkout"));
const OrderSuccess = lazy(() => import("./pages/Client/Cart/OrderSuccess"));
const VNPayReturn = lazy(() =>
  import("./pages/Client/VNPayReturn/VNPayReturn")
);
const Overview = lazy(() => import("./pages/Client/About/Overview"));
const PaymentGuide = lazy(() => import("./pages/Client/About/PaymentGuide"));
const Policies = lazy(() => import("./pages/Client/Policy/Policies"));
const ChangePassword = lazy(() =>
  import("./pages/Client/Account/ChangePassword/ChangePassword")
);
const OrderHistory = lazy(() =>
  import("./pages/Client/Account/OrderHistory/OrderHistory")
);
const OrderHistoryDetail = lazy(() =>
  import("./pages/Client/Account/OrderHistoryDetail/OrderHistoryDetail")
);
const UpdateInformation = lazy(() =>
  import("./pages/Client/Account/UpdateInformation/UpdateInformation")
);
const Dashboard = lazy(() => import("./pages/Admin/Dashboard/Dashboard"));
const UserList = lazy(() => import("./pages/Admin/UserManagement/UserList"));
const EditUser = lazy(() => import("./pages/Admin/UserManagement/EditUser"));
const CategoryList = lazy(() =>
  import("./pages/Admin/CategoryManagement/CategoryList")
);
const AddCategory = lazy(() =>
  import("./pages/Admin/CategoryManagement/AddCategory")
);
const EditCategory = lazy(() =>
  import("./pages/Admin/CategoryManagement/EditCategory")
);
const SliderList = lazy(() =>
  import("./pages/Admin/SliderManagement/SliderList")
);
const AddSlider = lazy(() =>
  import("./pages/Admin/SliderManagement/AddSlider")
);
const EditSlider = lazy(() =>
  import("./pages/Admin/SliderManagement/EditSlider")
);
const NewsCategoryList = lazy(() =>
  import("./pages/Admin/NewsCategoryManagement/NewsCategoryList")
);
const AddNewsCategory = lazy(() =>
  import("./pages/Admin/NewsCategoryManagement/AddCategory")
);
const EditNewsCategory = lazy(() =>
  import("./pages/Admin/NewsCategoryManagement/EditCategory")
);
const NewsList = lazy(() => import("./pages/Admin/NewsManagement/NewsList"));
const AddNews = lazy(() => import("./pages/Admin/NewsManagement/AddNews"));
const EditNews = lazy(() => import("./pages/Admin/NewsManagement/EditNews"));
const ProductList = lazy(() =>
  import("./pages/Admin/ProductManagement/ProductList")
);
const AddProduct = lazy(() =>
  import("./pages/Admin/ProductManagement/AddProduct")
);
const EditProduct = lazy(() =>
  import("./pages/Admin/ProductManagement/EditProduct")
);
const OrderList = lazy(() => import("./pages/Admin/OrderManagement/OrderList"));
const OrderDetail = lazy(() =>
  import("./pages/Admin/OrderManagement/OrderDetail")
);

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
            {
              path: ROUTE_PATH.POLICIES,
              element: <Policies />,
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
