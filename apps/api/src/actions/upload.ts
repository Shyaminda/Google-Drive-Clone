import prisma from "../lib/db";
import { getFileType } from "../utils/handler";
import dotenv from "dotenv";
import { handleDbFailure } from "../helpers/uploadDbFailure";
import { Prisma } from "@prisma/client";
import { type as PrismaType } from "@prisma/client";
import { FileUploadRequest, GetFilesProps } from "../type";

dotenv.config();

export const uploadFile = async ({ files, ownerId }: FileUploadRequest) => {
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
	searchText: string,
	sort: string,
	limit?: number,
): Prisma.FileFindManyArgs => {
	const where: Prisma.FileWhereInput = {
		AND: [
			{
				OR: [
					{ ownerId: currentUser.id },
					{ fileAccess: { some: { userId: currentUser.id } } },
					{ user: { has: currentUser.email } },
				],
			},
			type.length > 0 ? { type: { in: type.map((t) => t as PrismaType) } } : {},
			searchText
				? {
						OR: searchText.split(" ").map((word) => ({
							name: { contains: word, mode: "insensitive" },
						})),
					}
				: {},
		],
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
	searchText = "",
	sort = "desc",
	limit,
}: GetFilesProps) => {
	try {
		console.log({ getFiles: { currentUser, type, sort, limit } });
		if (!currentUser) throw new Error("User not found");

		const queries = createQueries(currentUser, type, searchText, sort, limit);

		console.log("Final Query:", JSON.stringify(queries, null, 2));

		const files = await prisma.file.findMany({
			...queries,
			include: {
				owner: true,
				fileAccess: {
					where: { userId: currentUser.id },
					select: { permissions: true },
				},
			},
		});

		return { success: true, files };
	} catch (error) {
		console.error("Error fetching files:", error);
		return { success: false, error: "Error fetching files" };
	}
};

//TODO: add CREATE INDEX file_name_fulltext_idx ON "File" USING gin(to_tsvector('english', name)); to prisma migration by docker later for faster search with tsvector
