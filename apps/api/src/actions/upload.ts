import AWS from "aws-sdk";
import prisma from "../lib/db";
import { getFileType, constructFileUrl } from "../utils/handler";
import dotenv from "dotenv";

dotenv.config();

interface FileUploadRequest {
	file: Express.Multer.File;
	ownerId: string;
	accountId: string;
}

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

interface UploadResult {
	ETag: string;
	ServerSideEncryption: string;
	Location: string;
	Key: string;
	Bucket: string;
}

export const uploadFile = async ({
	file,
	ownerId,
	accountId,
}: FileUploadRequest) => {
	if (!file) {
		return { success: false, error: "No file uploaded" };
	}

	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME!,
		Key: `${Date.now()}-${file.originalname}`,
		Body: file.buffer,
		ContentType: file.mimetype,
		// ACL: "public-read", // Uncomment this line if you want to make the file public
	};

	let uploadResult: UploadResult | undefined;

	try {
		const uploadResult = await s3.upload(params).promise();
		console.log("File uploaded successfully:", uploadResult);

		const fileUrl = constructFileUrl(uploadResult.Key);

		const fileDocument = await prisma.file.create({
			data: {
				type: getFileType(file.originalname).type,
				name: file.originalname,
				url: fileUrl,
				extension: getFileType(file.originalname).extension,
				size: file.size,
				ownerId: ownerId,
				accountId,
				bucketField: uploadResult.Key,
				user: [ownerId],
			},
		});

		return { success: true, file: fileDocument };
	} catch (error) {
		if (uploadResult && uploadResult.Key) {
			await s3
				.deleteObject({
					Bucket: process.env.AWS_S3_BUCKET_NAME!,
					Key: uploadResult.Key,
				})
				.promise();
			console.log("File deleted from S3 due to error");
		}
		console.error("Error uploading file:", error);
		return { success: false, error: "Error uploading file" };
	}
};
