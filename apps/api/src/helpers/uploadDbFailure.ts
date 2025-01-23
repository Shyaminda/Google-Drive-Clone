import { s3 } from "../utils/bucket";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const handleDbFailure = async (file: { key: string }) => {
	try {
		await s3.send(
			new DeleteObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME!,
				Key: file.key,
			}),
		);
		console.log(`File deleted from S3: ${file.key}`);
	} catch (s3Error) {
		console.error("Failed to delete file from S3:", s3Error);
	}

	return { success: false, error: "Error processing file" };
};
