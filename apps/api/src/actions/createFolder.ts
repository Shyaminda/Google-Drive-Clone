import prisma from "../lib/db";

export const createFolder = async (
	name: string,
	userId: string,
	inType: string,
	parentId?: string,
) => {
	try {
		const newFolder = await prisma.folder.create({
			data: {
				name,
				ownerId: userId,
				parentId: parentId || null,
				inType: inType,
			},
		});

		return { success: true, message: "Folder created successfully", newFolder };
	} catch (error) {
		console.error("Error creating folder:", error);
		return { success: false, error: "Failed to create folder" };
	}
};
