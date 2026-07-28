// import multer from "multer";
// import fs from "fs";
// import path from "path";

// // Folder
// const uploadDir = "uploads/documents/";

// // Create folder if not exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Storage config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },

//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const baseName = path
//             .basename(file.originalname, ext)
//             .replace(/\s+/g, "_");

//         const uniqueName = `${Date.now()}-${baseName}${ext}`;
//         cb(null, uniqueName);
//     },
// });

// // File filter (only image)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only JPG, JPEG, PNG allowed"), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
// });

// export default upload;

import multer from "multer";
import fs from "fs";
import path from "path";

// Upload Folder
const uploadDir = path.join(process.cwd(), "uploads", "documents");

// Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const fileName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");

    cb(null, `${Date.now()}-${fileName}${ext}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, JPEG and PNG images are allowed."), false);
  }

  cb(null, true);
};

// Upload
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10,
  },
});

export default upload;
