import prisma from "../lib/db";
import { GetFileProps } from "../type";

export const getFile = async ({ userId, fileId, type = [] }: GetFileProps) => {
	try {
		const file = await prisma.file.findMany({
			where: {
				ownerId: userId,
				id: fileId,
				type: { in: type },
			},
			select: {
				id: true,
				name: true,
				type: true,
				bucketField: true,
				extension: true,
				folderId: true,
				size: true,
				thumbnailUrl: true,
				createdAt: true,
				updatedAt: true,
				owner: {
					select: { id: true, name: true },
				},
			},
		});
		console.log("File fetched successfully:", file);

		return { success: true, message: "file fetched successfully", file };
	} catch (error) {
		console.error("Error fetching file:", error);
		return { success: false, error: "Failed to fetch file" };
	}
};
