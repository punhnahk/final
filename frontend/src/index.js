import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css"; // Ensure your CSS is optimized and minified
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";

// Lazy load App component
const App = lazy(() => import("./App"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="1013298330073-057u4c45bj90o463me8s1lddhtcj17n6.apps.googleusercontent.com">
      <Suspense>
        <App />
      </Suspense>
    </GoogleOAuthProvider>
  </Provider>
);

reportWebVitals(console.log); // Log results for performance analysis
