import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/bucket";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import prisma from "../lib/db";
import { AuthenticatedRequest } from "../type";

const checkUserStorage = async (
	req: AuthenticatedRequest,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	try {
		const userId = req.userId as string;
		if (!userId) {
			return cb(new Error("User not authenticated"));
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { maxStorage: true, usedStorage: true },
		});

		if (!user) {
			return cb(new Error("User not found"));
		}

		const remainingStorage = user.maxStorage - user.usedStorage;
		if (remainingStorage < file.size) {
			return cb(new Error("Not enough storage space available"));
		}

		cb(null, true);
	} catch (error) {
		cb(error as Error);
	}
};

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
	limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50 MB
	fileFilter: checkUserStorage,
});
console.log("multer reached");
export const uploadMiddleware = upload.array("file");
