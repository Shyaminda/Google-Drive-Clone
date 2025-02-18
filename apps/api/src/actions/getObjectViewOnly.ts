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
