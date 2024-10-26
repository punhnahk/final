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
    <GoogleOAuthProvider clientId="your-client-id">
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </GoogleOAuthProvider>
  </Provider>
);

reportWebVitals(console.log); // Log results for performance analysis
