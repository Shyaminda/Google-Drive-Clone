// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { Readable } from "stream";

// const s3 = new S3Client({ region: process.env.AWS_REGION });

// export const objectViewOnly = async (bucketField: string, res: any) => {
// 	if (!bucketField) {
// 		throw new Error("Invalid bucketField");
// 	}

// 	try {
// 		const command = new GetObjectCommand({
// 			Bucket: process.env.AWS_S3_BUCKET_NAME as string,
// 			Key: bucketField,
// 			ResponseContentDisposition: "inline",
// 		});

// 		const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
// 		console.log("Pre-signed URL reached");
// 		console.log("Pre-signed URL view only:", signedUrl);

// 		const response = await fetch(signedUrl);
// 		const contentType =
// 			response.headers.get("Content-Type") || "application/octet-stream";

// 		res.setHeader("Content-Type", contentType);
// 		res.setHeader("Cache-Control", "no-store");

// 		const nodeStream = Readable.from(response.body || "");
// 		console.log("Node stream reached", nodeStream);
// 		nodeStream.pipe(res);
// 	} catch (error) {
// 		console.error("Error fetching file:", error);
// 		return { success: false, error: "Internal server error" };
// 	}
// };

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const objectViewOnly = async (bucketField: string, res: any) => {
	if (!bucketField) {
		res.status(400).json({ success: false, error: "Invalid bucketField" });
		return;
	}

	try {
		const command = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME as string,
			Key: bucketField,
			// ResponseContentDisposition: "inline",
		});

		const { Body, ContentType } = await s3.send(command);

		if (!Body) {
			res.status(404).json({ success: false, error: "File not found" });
			return;
		}

		res.set({
			"Content-Type": ContentType || "application/octet-stream",
			"Content-Disposition": "inline",
			"Cache-Control": "no-store, max-age=0",
			"X-Content-Type-Options": "nosniff",
			"Content-Security-Policy": "default-src 'none'",
		});

		(Body as NodeJS.ReadableStream).pipe(res);
	} catch (error) {
		console.error("Error fetching file:", error);
		return { success: false, error: "Internal server error" };
	}
};
