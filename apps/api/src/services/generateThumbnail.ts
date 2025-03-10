import sharp from "sharp";
import { uploadFileToBucket } from "../utils/uploadBucket";

async function generateThumbnail(file: Buffer, fileId: string) {
	try {
		const metadata = await sharp(file).metadata();
		if (
			metadata.width &&
			metadata.height &&
			(metadata.width < 50 || metadata.height < 50)
		) {
			console.warn("Skipping thumbnail generation: Image too small");
			return null;
		}

		const thumbnailBuffer = await sharp(file)
			.resize(50, 50, { fit: "cover" })
			.png({ quality: 90 })
			.sharpen()
			.toBuffer();

		const circleMask = await sharp({
			create: {
				width: 50,
				height: 50,
				channels: 4,
				background: { r: 255, g: 255, b: 255, alpha: 1 },
			},
		})
			.png()
			.toBuffer();

		const circularThumbnailBuffer = await sharp(thumbnailBuffer)
			.composite([{ input: circleMask, blend: "dest-in" }])
			.toBuffer();

		const thumbnailUrl = await uploadFileToBucket(
			circularThumbnailBuffer,
			`thumbnails/${fileId}.jpg`,
		);
		console.log("Thumbnail generated");

		return thumbnailUrl;
	} catch (error) {
		console.error("Thumbnail generation failed:", error);
		return null;
	}
}

export default generateThumbnail;

//TODO: cache the thumbnail and thumbnail url is visible in the frontend mitigate the issue
