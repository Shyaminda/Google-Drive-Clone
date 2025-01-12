import multer from "multer";

const upload = multer();
export const uploadMiddleware = upload.single("file");
