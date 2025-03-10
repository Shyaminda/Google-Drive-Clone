import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/bucket";

const EXPIRATION_TIME_MS = 5 * 60 * 1000; // 5 minutes

export const objectViewOnlyStreaming = async (
	bucketField: string,
	res: any,
	timestamp: number,
	range?: string,
) => {
	if (!bucketField) {
		return res
			.status(400)
			.json({ success: false, error: "Invalid bucketField" });
	}

	try {
		if (!timestamp) {
			return res
				.status(400)
				.json({ success: false, error: "Missing timestamp" });
		}

		const requestTime = Number(timestamp);
		const currentTime = Date.now();

		if (currentTime - requestTime > EXPIRATION_TIME_MS) {
			return res.status(403).json({ success: false, error: "Access expired" });
		}

		const headCommand = new HeadObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME as string,
			Key: bucketField,
		});
		const metadata = await s3.send(headCommand);
		const contentLength = metadata.ContentLength || 0;
		const contentType = metadata.ContentType || "application/octet-stream";

		if (!range) {
			const fullCommand = new GetObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME as string,
				Key: bucketField,
			});

			const { Body } = await s3.send(fullCommand);
			if (!Body) {
				return res
					.status(404)
					.json({ success: false, error: "File not found" });
			}

			console.log("reached !range");

			res.set({
				"Content-Type": contentType,
				"Content-Length": contentLength,
				"Accept-Ranges": "bytes",
				"Cache-Control": "no-store, max-age=0",
				"Access-Control-Expose-Headers": "Content-Range",
				//"X-Content-Type-Options": "nosniff",
				//"Content-Security-Policy": "default-src 'none'; frame-ancestors 'self'",
			});

			return (Body as NodeJS.ReadableStream).pipe(res);
		}

		const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
		const start = parseInt(startStr, 10);
		const end = endStr ? parseInt(endStr, 10) : contentLength - 1;
		const chunkSize = end - start + 1;

		const rangeCommand = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME as string,
			Key: bucketField,
			Range: `bytes=${start}-${end}`,
		});
		const { Body } = await s3.send(rangeCommand);

		if (!Body) {
			return res.status(404).json({ success: false, error: "File not found" });
		}

		console.log("contentType", contentType);

		console.log("reached range bytes");

		res.status(206).set({
			"Content-Type": contentType,
			"Content-Range": `bytes ${start}-${end}/${contentLength}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunkSize,
			"Cache-Control": "no-store, max-age=0",
			//"X-Content-Type-Options": "nosniff",
			//"Content-Security-Policy": "default-src 'none'; frame-ancestors 'self'",
		});

		(Body as NodeJS.ReadableStream).pipe(res);
	} catch (error) {
		console.error("Error fetching file:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error" });
	}
};
