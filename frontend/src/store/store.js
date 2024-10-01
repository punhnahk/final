import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import cartSlice from "./cartSlice";

export default configureStore({
  reducer: {
    profile: profileReducer,
    cart: cartSlice,
  },
});
