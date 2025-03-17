import { deleteFileInS3 } from "../helpers/deleteObject";
import prisma from "../lib/db";

const deleteFolderRecursively = async (tx: any, folderId: string) => {
	const currentFolder = await tx.folder.findUnique({
		where: { id: folderId },
		include: { subFolders: true, files: true },
	});

	if (!currentFolder) return;

	for (const file of currentFolder.files) {
		await deleteFileInS3(file.bucketField);

		await tx.fileAccess.deleteMany({
			where: { fileId: file.id },
		});

		await tx.file.delete({ where: { id: file.id } });
	}

	for (const subFolder of currentFolder.subFolders) {
		await deleteFolderRecursively(tx, subFolder.id);
	}

	await tx.folder.delete({ where: { id: folderId } });
};

export const deleteFolder = async (userId: string, folderId: string) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return { success: false, message: "User not found" };
		}

		const folder = await prisma.folder.findUnique({
			where: { id: folderId },
			include: {
				subFolders: true,
				files: true,
			},
		});
		if (!folder) {
			return { success: false, message: "Folder not found" };
		}

		if (folder.ownerId !== userId) {
			return {
				success: false,
				message: "You do not have permission to delete this folder",
			};
		}

		await prisma.$transaction(async (tx) => {
			await deleteFolderRecursively(tx, folderId);

			const folderSize = folder.files.reduce(
				(acc, file) => acc + (file.size || 0),
				0,
			);

			await tx.user.update({
				where: { id: userId },
				data: { usedStorage: { decrement: folderSize } },
			});
		});

		return {
			success: true,
			message: "Folder and its contents deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting folder:", error);
		return { success: false, error: "Failed to delete folder" };
	}
};
