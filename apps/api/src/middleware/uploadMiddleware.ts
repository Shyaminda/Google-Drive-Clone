import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/bucket";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_S3_BUCKET_NAME!,
		metadata: (req, file, cb) => {
			cb(null, {
				fieldName: file.fieldname,
			});
		},
		key: (req, file, cb) => {
			const fileExtension = path.extname(file.originalname);
			const uniqueKey = `${uuidv4()}${fileExtension}`;
			cb(null, uniqueKey);
		},
		contentType: (req, file, cb) => {
			cb(null, file.mimetype);
		},
	}),
});
console.log("multer reached");
export const uploadMiddleware = upload.array("file");
