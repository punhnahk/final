import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartApi from "../api/cartApi";

export const getMyCarts = createAsyncThunk("cart/getMyCarts", async () => {
  const res = await cartApi.getMyCarts();

  return res.data;
});

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  ({ productId, quantity }) => {
    return cartApi.updateQuantity({ productId, quantity });
  }
);

export const deleteCartProduct = createAsyncThunk(
  "cart/deleteProduct",
  (productId) => {
    return cartApi.deleteProduct(productId);
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyCarts.fulfilled, (state, { payload }) => {
      state.cart = payload;
    });
  },
});

export const selectCart = (state) => state.cart.cart;

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
