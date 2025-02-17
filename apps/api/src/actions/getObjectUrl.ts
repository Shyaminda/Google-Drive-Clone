import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getPresignedUrl = async (
	bucketField: string,
	isDownload: boolean,
) => {
	if (
		!bucketField ||
		typeof bucketField !== "string" ||
		bucketField.trim() === ""
	) {
		return { success: false, error: "Invalid or missing bucketField" };
	}

	if (typeof isDownload !== "boolean") {
		return { success: false, error: "isDownload is invalid" };
	}

	try {
		const client = new S3Client({ region: process.env.AWS_REGION });
		const command = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME as string,
			Key: bucketField,
			ResponseContentDisposition: isDownload
				? `attachment; filename="${bucketField.split("/").pop()}"`
				: `inline`,
		});
		const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
		console.log("Pre-signed URL:", signedUrl);
		return { success: true, url: signedUrl };
	} catch (err) {
		console.error("Error generating pre-signed URL:", err);
		return { success: false, error: "Failed to generate pre-signed URL" };
	}
};

// import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { objectViewOnly } from "./getObjectViewOnly";

// export const getPresignedUrl = async (
// 	bucketField: string,
// 	isDownload: boolean,
// 	res: any,
// ) => {
// 	if (
// 		!bucketField ||
// 		typeof bucketField !== "string" ||
// 		bucketField.trim() === ""
// 	) {
// 		return { success: false, error: "Invalid or missing bucketField" };
// 	}

// 	if (typeof isDownload !== "boolean") {
// 		return { success: false, error: "isDownload is invalid" };
// 	}

// 	try {
// 		const client = new S3Client({ region: process.env.AWS_REGION });
// 		let signedUrl: string;

// 		if (isDownload) {
// 			const command = new GetObjectCommand({
// 				Bucket: process.env.AWS_S3_BUCKET_NAME as string,
// 				Key: bucketField,
// 				ResponseContentDisposition: `attachment; filename="${bucketField.split("/").pop()}"`,
// 			});

// 			signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
// 			console.log("Pre-signed URL:", signedUrl);

// 			return { success: true, url: signedUrl };
// 		} else {
// 			await objectViewOnly(bucketField, res);
// 			return;
// 		}
// 	} catch (err) {
// 		console.error("Error generating pre-signed URL:", err);
// 		return { success: false, error: "Failed to generate pre-signed URL" };
// 	}
// };
