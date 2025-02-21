import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloud.js";

// Configure Cloudinary storage for videos
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "videos", // Folder name in Cloudinary
        resource_type: "video", // Ensure Cloudinary treats it as a video
        format: async (req, file) => "mp4", // Convert files to mp4
    },
});

// Multer middleware for handling video uploads
const fileUpload = multer({ storage });

export default fileUpload;
