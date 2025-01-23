import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/bucket";
import { v4 as uuidv4 } from "uuid";

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
			const uniqueKey = `${uuidv4()}`;
			cb(null, uniqueKey);
		},
		contentType: (req, file, cb) => {
			cb(null, file.mimetype);
		},
	}),
	limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50 MB
});
console.log("multer reached");
export const uploadMiddleware = upload.array("file");
