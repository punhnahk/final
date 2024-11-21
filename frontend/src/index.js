import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css"; // Ensure your CSS is optimized and minified
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";

// Lazy load App component
const App = lazy(() => import("./App"));
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="text-white mt-4 text-xl font-bold">Loading...</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="1013298330073-057u4c45bj90o463me8s1lddhtcj17n6.apps.googleusercontent.com">
      <Suspense fallback={LoadingSpinner}>
        <App />
      </Suspense>
    </GoogleOAuthProvider>
  </Provider>
);

reportWebVitals(console.log); // Log results for performance analysis
