import apiClient from "./apiClient";

const wishlistApi = {
  // Fetches the user's wishlist
  getWishlist: () => {
    return apiClient.get(`/wishlists`);
  },

  // Adds a product to the user's wishlist
  addToWishlist: (id) => {
    return apiClient.post("/wishlists/add", { id });
  },

  // Removes a product from the user's wishlist
  removeFromWishlist: (id) => {
    return apiClient.put(`/wishlists/remove/${id}`);
  },
};

export default wishlistApi;
