import express from "express";
import { confirmOrder, createOrder } from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-checkout-session", createOrder);

router.post("/webhook", express.raw({ type: "application/json" }), confirmOrder);

export default router;
