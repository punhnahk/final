import Cart from "../models/carts.js";

const CartController = {
  addCart: async (req, res) => {
    try {
      const user = req.user.id;
      const { productId, quantity } = req.body;

      let foundCart = await Cart.findOne({ user }).exec();

      let response;
      if (foundCart) {
        const foundProduct = foundCart.products.find((it) => {
          return it.product.toString() === productId;
        });

        if (foundProduct) {
          foundProduct.quantity += quantity;

          const newProducts = foundCart.products.map((it) =>
            it.product.toString() === foundProduct.product.toString()
              ? foundProduct
              : it
          );
          foundCart.products = newProducts;
        } else {
          foundCart.products.push({
            product: productId,
            quantity,
          });
        }

        response = await foundCart.save();
      } else {
        response = await new Cart({
          products: [
            {
              product: productId,
              quantity,
            },
          ],
          user,
        }).save();
      }

      res.json({
        message: "Add cart successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        message: error.message,
      });
    }
  },

  getMyCarts: async (req, res) => {
    try {
      const user = req.user.id;
      let data = await Cart.findOne({ user })
        .populate({
          path: "products.product",
          model: "products",
        })
        .exec();

      data.products = data.products.reverse();

      const totalPrice = data.products.reduce((res, curr) => {
        const productPrice =
          curr.product.salePrice > 0
            ? curr.product.salePrice
            : curr.product.price;

        res += productPrice * curr.quantity;

        return res;
      }, 0);

      res.json({
        ...data.toJSON(),
        totalPrice,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const user = req.user.id;
      const { productId } = req.params;

      const cart = await Cart.findOne({ user }).exec();
      const newProducts = cart.products.filter(
        (it) => it.product._id.toString() !== productId
      );

      cart.products = newProducts;
      await cart.save();

      res.json(newProducts);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const user = req.user.id;
      const { productId, quantity } = req.body;

      const cart = await Cart.findOne({ user }).exec();
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }

      const newProducts = cart.products.map((it) =>
        it.product._id.toString() === productId ? { ...it, quantity } : it
      );
      cart.products = newProducts;
      await cart.save();

      res.json(newProducts);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default CartController;
