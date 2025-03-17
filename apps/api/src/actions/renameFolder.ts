import prisma from "../lib/db";

export const renameFolder = async (folderId: string, newName: string) => {
	try {
		const folder = await prisma.folder.findUnique({
			where: { id: folderId },
		});

		if (!folder) {
			return { success: false, error: "Folder not found" };
		}

		const newFoldername = await prisma.folder.update({
			where: { id: folderId },
			data: { name: newName },
		});

		return {
			success: true,
			folder: newFoldername,
			message: "Folder renamed successfully",
		};
	} catch (error) {
		console.error("Error renaming folder", error);
		return { success: false, error: "Error renaming folder" };
	}
};
