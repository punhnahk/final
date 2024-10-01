export const ROUTE_PATH = {
  HOME: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  FORGOT_PASSWORD: "/auth/forgot-password",

  ACCOUNT: "/account",
  CHANGE_PASSWORD: "/account/change-password",
  ORDERS_HISTORY: "/account/orders-history",
  ORDER_HISTORY_DETAIL: (param) => `/account/orders-history/${param}/detail`,

  PRODUCT_DETAIL: (param) => `/products/${param}`,

  PRODUCTS_LIST: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order-success",
  VNPAY_RETURN: "/vnpay-return",

  // admin
  ADMIN: "/admin",
  USER_MANAGEMENT: "/admin/users",
  EDIT_USER: (param) => `/admin/users/${param}/edit`,

  CATEGORY_MANAGEMENT: "/admin/categories",
  ADD_CATEGORY: "/admin/categories/add",
  EDIT_CATEGORY: (param) => `/admin/categories/${param}/edit`,

  SLIDER_MANAGEMENT: "/admin/sliders",
  ADD_SLIDER: "/admin/sliders/add",
  EDIT_SLIDER: (param) => `/admin/sliders/${param}/edit`,

  NEWS_CATEGORY_MANAGEMENT: "/admin/news-categories",
  ADD_NEWS_CATEGORY: "/admin/news-categories/add",
  EDIT_NEWS_CATEGORY: (param) => `/admin/news-categories/${param}/edit`,

  NEWS_MANAGEMENT: "/admin/posts",
  ADD_NEWS: "/admin/posts/add",
  EDIT_NEWS: (param) => `/admin/posts/${param}/edit`,

  PRODUCT_MANAGEMENT: "/admin/products",
  ADD_PRODUCT: "/admin/products/add",
  EDIT_PRODUCT: (param) => `/admin/products/${param}/edit`,

  ORDER_MANAGEMENT: "/admin/orders",
  ORDER_DETAIL: (param) => `/admin/orders/${param}/view`,
};
