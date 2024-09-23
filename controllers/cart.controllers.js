import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingCartItem = cart.items.find(item => item.product.toString() === productId);
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    // Save the updated cart
    await cart.save();

    // Re-populate the product details in the cart
    await cart.populate("items.product");

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id; // Use the id from the URL params
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1); // Remove the item from cart

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
