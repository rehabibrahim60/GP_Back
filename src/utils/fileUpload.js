// import multer, { diskStorage } from "multer";
// import path from "path";

// export const fileUpload = () => {
//     const fileFilter = (req, file, cb) => {
//         const allowedMimeTypes = [
//             "image/png", "image/jpeg", // Images
//             "video/mkv" , "video/mp4", "video/mov", "video/avi",  // Videos
//             "application/pdf", // PDFs
//             "application/msword", // DOC
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
//             "application/vnd.ms-powerpoint", // PPT
//             "application/vnd.openxmlformats-officedocument.presentationml.presentation" // PPTX
//         ];

//         if (!allowedMimeTypes.includes(file.mimetype)) {
//             return cb(new Error("Invalid file format"), false);
//         }
//         return cb(null, true);
//     };

//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, "./uploads");  // Store in a persistent directory
//         },
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + path.extname(file.originalname));
//         },
//     });
    
//     return multer({
//         storage,
//         fileFilter,
//         limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
//     });
// };


import multer, { diskStorage } from "multer";

export const fileUpload = (allowedTypes = []) => {
    const fileFilter = (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Invalid file format"), false);
        }
        return cb(null, true);
    };

    return multer({ storage: diskStorage({}), fileFilter });
};





