import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    rating: { type: Number, default: 0 },
    intensity: { type: String, required: true },
  },
  { timestamps: true },
);

const Product = model("Product", productSchema);

export default Product;
