import prisma from "../lib/db";
import { getFileType } from "../utils/handler";
import dotenv from "dotenv";
import { handleDbFailure } from "../helpers/uploadDbFailure";
import { FileUploadRequest } from "../type";
import { serializeBigInt } from "../utils/bigIntSerializer";

dotenv.config();

export const uploadFile = async ({ files, ownerId }: FileUploadRequest) => {
	if (!files || files.length === 0) {
		return { success: false, error: "No file to uploaded" };
	}

	const uploadedFiles = [];

	try {
		const user = await prisma.user.findUnique({
			where: { id: ownerId },
			select: { usedStorage: true, maxStorage: true },
		});

		if (!user) {
			return { success: false, error: "User not found" };
		}

		let totalFileSize = 0;
		for (const file of files) {
			totalFileSize += file.size;
		}

		const remainingStorage = BigInt(user.maxStorage) - BigInt(user.usedStorage);
		if (BigInt(totalFileSize) > remainingStorage) {
			return { success: false, error: "Not enough storage space available" };
		}

		for (const file of files) {
			const fileKey = file.key;

			if (!fileKey) {
				throw new Error("File upload failed, no file available");
			}

			const fileUrl = file.location;

			const fileDocument = await prisma.file.create({
				data: {
					type: getFileType(file.originalname).type,
					name: file.originalname,
					url: fileUrl,
					extension: getFileType(file.originalname).extension,
					size: file.size,
					ownerId: ownerId,
					bucketField: fileKey,
					user: [ownerId],
					fileAccess: {
						create: {
							userId: ownerId,
							accessLevel: "OWNER",
							sharedById: ownerId,
						},
					},
				},
			});

			uploadedFiles.push(fileDocument);
		}

		await prisma.user.update({
			where: { id: ownerId },
			data: {
				usedStorage: BigInt(user.usedStorage) + BigInt(totalFileSize),
			},
		});

		return serializeBigInt({ success: true, files: uploadedFiles });
	} catch (error) {
		console.error("Error processing file:", error);
		for (const file of files) {
			if (file.key) {
				const deleteBucketFile = await handleDbFailure({ key: file.key });
				if (!deleteBucketFile.success) {
					console.error(
						"Failed to delete file from S3:",
						deleteBucketFile.error,
					);
				}
			}
		}
		return { success: false, error: "Error uploading file" };
	}
};

//TODO: add CREATE INDEX file_name_fulltext_idx ON "File" USING gin(to_tsvector('english', name)); to prisma migration by docker later for faster search with tsvector
