import { Router } from "express";
import { getAllProducts, getProductById, postProduct, updateProduct } from "../controllers/product.controllers.js";
import { upload } from "../config/multer.js";

const router = Router();

router.post("/", upload.array("images", 4), postProduct);
router.patch("/:productId", upload.array("images", 4), updateProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
