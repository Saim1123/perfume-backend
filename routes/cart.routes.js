import { Router } from "express";
import {
  addItemToCart,
  clearCart,
  getUserCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../controllers/cart.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, addItemToCart);
router.get("/", verifyToken, getUserCart);
router.put("/update", verifyToken, updateItemQuantity);
router.delete("/remove/:id", verifyToken, removeItemFromCart);
router.delete("/clear", verifyToken, clearCart);

export default router;
