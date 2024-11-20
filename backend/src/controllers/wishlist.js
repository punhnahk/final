import Wishlist from "../models/wishlist.js";

const wishlistController = {
  addToWishlist: async (req, res) => {
    const { productId } = req.body.id;

    try {
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      let wishlist = await Wishlist.findOne({ user: req.user.id });

      if (!wishlist) {
        wishlist = new Wishlist({
          user: req.user.id,
          products: [productId],
        });
      } else {
        if (wishlist.products.includes(productId)) {
          return res
            .status(400)
            .json({ message: "Product already in wishlist" });
        }

        // Add product to the wishlist
        wishlist.products.push(productId);
      }

      // Save the wishlist
      await wishlist.save();
      res.status(200).json({ message: "Added to wishlist", wishlist });
    } catch (error) {
      res.status(500).json({ message: "Error adding to wishlist", error });
    }
  },

  removeFromWishlist: async (req, res) => {
    try {
      const user = req.user.id;
      const { productId } = req.params;
      console.log("Product ID to remove:", productId);

      const wishlist = await Wishlist.findOne({ user }).exec();
      console.log("Current wishlist:", wishlist);

      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }
      const newProducts = wishlist.products.filter(
        (item) => item.toString() !== productId
      );

      wishlist.products = newProducts; // Update the wishlist products
      await wishlist.save(); // Save the updated wishlist

      res.status(200).json({ message: "Removed from wishlist", wishlist });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Error removing from wishlist", error });
    }
  },

  getWishlist: async (req, res) => {
    try {
      let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
        "products"
      );

      if (!wishlist) {
        wishlist = { products: [] };
      }

      res.status(200).json(wishlist.products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching wishlist", error });
    }
  },
};
export default wishlistController;
