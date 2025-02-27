import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// In cloudinary.js
const uploadOnCloudinary = async (file) => {
    try {
        if (!file) {
            throw new Error("No file provided");
        }
        
        console.log("Uploading file to Cloudinary:", file);
        
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        });

        // Validate Cloudinary response
        if (!result || !result.public_id || !result.secure_url) {
            throw new Error("Invalid response from Cloudinary");
        }

        const uploadedFile = {
            public_id: result.public_id,
            url: result.secure_url
        };

        console.log("File uploaded successfully:", uploadedFile);
        return uploadedFile;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error; // Propagate error instead of returning null
    } finally {
        // Clean up temp file
        if (file) {
            try {
                fs.unlinkSync(file);
                console.log("Temporary file deleted:", file);
            } catch (err) {
                console.error("Error deleting temp file:", err);
            }
        }
    }
};

export { uploadOnCloudinary };