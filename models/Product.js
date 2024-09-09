import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    rating: { type: Number, default: 0 },
    intensity: { type: String, required: true, enum: ["light", "medium", "strong"] },
    size: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "unisex"], required: true },
    fragranceFamily: { type: String, required: true },
    reviews: [{ type: String }],
  },
  { timestamps: true },
);

const Product = model("Product", productSchema);

export default Product;
