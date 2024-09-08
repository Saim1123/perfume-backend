import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async localFilePath => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Auto-detect image type
    });
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  } finally {
    // Cleanup: Remove the file from the local filesystem
    fs.unlink(localFilePath, err => {
      if (err) console.error("Error deleting local file:", err);
    });
  }
};
