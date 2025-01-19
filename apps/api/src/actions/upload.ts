import prisma from "../lib/db";
import { getFileType } from "../utils/handler";
import dotenv from "dotenv";
import { handleDbFailure } from "../helpers/dbFailure";
import { Prisma } from "@prisma/client";
import { type as PrismaType } from "@prisma/client";
import { FileUploadRequest, GetFilesProps } from "../type";

dotenv.config();

export const uploadFile = async ({
	files,
	ownerId,
	accountId,
}: FileUploadRequest) => {
	if (!files || files.length === 0) {
		return { success: false, error: "No file to uploaded" };
	}

	const uploadedFiles = [];

	try {
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
					accountId,
					bucketField: fileKey,
					user: [ownerId],
				},
			});

			uploadedFiles.push(fileDocument);
		}

		return { success: true, files: uploadedFiles };
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

const createQueries = (
	currentUser: { id: string; email: string },
	type: string[],
	//searchText: string,
	sort: string,
	limit?: number,
): Prisma.FileFindManyArgs => {
	const where: Prisma.FileWhereInput = {
		OR: [{ ownerId: currentUser.id }, { user: { has: currentUser.email } }],
		...(type.length > 0 && {
			type: { in: type.map((t) => t as PrismaType) },
		}),
	};

	const orderBy: Prisma.FileOrderByWithRelationInput[] = [];
	if (sort) {
		const [sortBy, orderByDirection] = sort.split("-");
		if (sortBy && orderByDirection) {
			orderBy.push({
				[sortBy]: orderByDirection === "asc" ? "asc" : "desc",
			});
		}
	}

	return {
		where,
		...(orderBy.length > 0 && { orderBy }),
		...(limit && { take: limit }),
	};
};

export const getFiles = async ({
	currentUser,
	type = [],
	//searchText = "",
	sort = "desc",
	limit,
}: GetFilesProps) => {
	try {
		console.log({ currentUser, type, sort, limit });
		if (!currentUser) throw new Error("User not found");

		const queries = createQueries(currentUser, type, sort, limit);

		const files = await prisma.file.findMany({
			...queries,
			include: { owner: true },
		});

		return { success: true, files };
	} catch {
		return { success: false, error: "Error fetching files" };
	}
};
