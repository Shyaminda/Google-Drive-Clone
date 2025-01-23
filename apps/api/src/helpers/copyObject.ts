import { CopyObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/bucket";

export const copyFileInS3 = async (sourceKey: string, targetKey: string) => {
	try {
		await s3.send(
			new CopyObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${sourceKey}`,
				Key: targetKey,
			}),
		);
	} catch (error) {
		console.error(
			`Error copying file from ${sourceKey} to ${targetKey}`,
			error,
		);
		return { success: false, message: "Failed to copy file" };
	}
};
