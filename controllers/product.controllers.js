import Product from "../models/Product.js";
import fs from "fs";
import { uploadOnCloudinary } from "../config/cloudinary.js";

// export const postProduct = async (req, res) => {
//   const { name, price, description, stock, intensity, gender, brand } = req.body;
//   const files = req.files;

//   if (!name || !price || !description || !stock || !intensity || !gender || !brand) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   console.log(files);

//   try {
//     if (!files || files.length < 1 || files.length > 4) {
//       return res.status(400).json({ error: "A product must have between 1 and 4 images" });
//     }

//     const imageUrls = [];

//     for (let file of files) {
//       const uploadResult = await uploadOnCloudinary(file.path);
//       if (uploadResult) {
//         imageUrls.push(uploadResult.url);
//         await fs.unlink(file.path);
//       } else {
//         console.error("Failed to upload images");
//       }
//     }

//     const product = await Product.create({
//       name,
//       price,
//       description,
//       stock,
//       intensity,
//       gender,
//       brand,
//       images: imageUrls,
//     });

//     if (product) return res.status(201).json(product);

//     res.status(400).json({ message: "failed to save on database" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }

//   const product = await Product.create({ name, price, description, stock, intensity, gender, brand });
// };

export const postProduct = async (req, res) => {
  const { name, price, description, stock, intensity, gender, brand } = req.body;
  const files = req.files;

  if (!name || !price || !description || !stock || !intensity || !gender || !brand) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    if (!files || files.length < 1 || files.length > 4) {
      return res.status(400).json({ error: "A product must have between 1 and 4 images" });
    }

    const imageUrls = [];

    for (let file of files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult) {
        imageUrls.push(uploadResult.secure_url); // Store secure_url from Cloudinary
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
      images: imageUrls,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error during product creation:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

export const getAllProducts = async (req, res) => {};

export const updateProduct = async (req, res) => {};
