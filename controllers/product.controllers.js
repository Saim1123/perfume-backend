import Product from "../models/Product.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export const postProduct = async (req, res) => {
  const { name, price, description, stock, intensity, gender, brand, fragranceFamily, size } = req.body;
  const files = req.files;

  if ((!name || !price || !description || !stock || !intensity || !gender || !brand || !fragranceFamily, !size)) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Atleast 1 image is required." });
    }

    if (files.length > 4) {
      return res.status(400).json({ error: "A product must have between 1 and 4 images" });
    }

    const imageUrls = [];

    for (let file of files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult) {
        imageUrls.push(uploadResult.secure_url); // Store secure_url from Cloudinary
      } else {
        return res.status(400).json({ error: "Image upload failed" });
      }
    }

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      intensity,
      gender,
      brand,
      size,
      fragranceFamily,
      images: imageUrls,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error during product creation:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(400).json("No Product Found!");
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error during fetching the product:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json("No Product Found!");
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error during fetching the product:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const updateProduct = async (req, res) => {};
