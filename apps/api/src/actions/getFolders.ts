import prisma from "../lib/db";

export const getFolders = async (
	userId: string,
	inType: string,
	parentId?: string,
) => {
	try {
		const folders = await prisma.folder.findMany({
			where: {
				ownerId: userId,
				inType,
				parentId: parentId ? parentId : null,
			},
			select: {
				id: true,
				name: true,
			},
		});

		return { success: true, message: "Folders fetched successfully", folders };
	} catch (error) {
		console.error("Error fetching folders:", error);
		return { success: false, error: "Failed to fetch folders" };
	}
};
