import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const EXPIRATION_TIME_MS = 5 * 60 * 1000;

export const objectViewOnly = async (
	bucketField: string,
	res: any,
	timestamp: number,
) => {
	if (!bucketField) {
		res.status(400).json({ success: false, error: "Invalid bucketField" });
		return;
	}

	try {
		if (!timestamp) {
			res.status(400).json({ success: false, error: "Missing timestamp" });
			return;
		}

		const requestTime = Number(timestamp);
		const currentTime = Date.now();

		if (currentTime - requestTime > EXPIRATION_TIME_MS) {
			res.status(403).json({ success: false, error: "Access expired" });
			return;
		}

		const command = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME as string,
			Key: bucketField,
		});

		const { Body, ContentType } = await s3.send(command);
		console.log("content type", ContentType);
		if (!Body) {
			res.status(404).json({ success: false, error: "File not found" });
			return;
		}

		res.set({
			"Content-Type": ContentType || "application/octet-stream",
			"Content-Disposition": "inline",
			"Cache-Control": "no-store, max-age=0",
			"X-Content-Type-Options": "nosniff",
			"Content-Security-Policy": "default-src 'none'; frame-ancestors 'self'", // Prevent embedding
		});

		(Body as NodeJS.ReadableStream).pipe(res);
	} catch (error) {
		console.error("Error fetching file:", error);
		return { success: false, error: "Internal server error" };
	}
};
