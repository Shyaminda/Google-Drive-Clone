import prisma from "../lib/db";

export const createFolder = async (
	name: string,
	userId: string,
	parentId?: string,
) => {
	try {
		const newFolder = await prisma.folder.create({
			data: {
				name,
				ownerId: userId,
				parentId: parentId || null,
			},
		});

		return { success: true, message: "Folder created successfully", newFolder };
	} catch (error) {
		console.error("Error creating folder:", error);
		return { success: false, error: "Failed to create folder" };
	}
};
