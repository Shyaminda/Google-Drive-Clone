import { s3 } from "../utils/bucket";
import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

export async function uploadFileToBucket(
	fileBuffer: Buffer,
	key: string,
	contentType: string = "image/jpeg",
): Promise<string> {
	try {
		console.log("uploading file to S3 reached");
		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME!,
			Key: key,
			Body: fileBuffer,
			ContentType: contentType,
			//ACL: "public-read" as ObjectCannedACL,
		};

		await s3.send(new PutObjectCommand(params));

		return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw new Error("Failed to upload file to S3");
	}
}
