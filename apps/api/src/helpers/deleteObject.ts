import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/bucket";

export const deleteFileInS3 = async (key: string) => {
	try {
		await s3.send(
			new DeleteObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: key,
			}),
		);
	} catch (error) {
		console.error(`Error deleting file in S3: ${key}`, error);
		return { success: false, message: "Failed to delete file" };
	}
};
