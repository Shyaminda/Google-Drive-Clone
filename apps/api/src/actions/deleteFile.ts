import prisma from "../lib/db";

export const deleteFile = async (userId: string, fileId: string) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			return {
				success: false,
				error: "User not found",
			};
		}

		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			return { success: false, error: "File not found" };
		}

		const isOwner = file.ownerId === userId;

		if (isOwner) {
			await prisma.fileAccess.deleteMany({ where: { fileId } });
			await prisma.file.delete({ where: { id: fileId } });

			return { success: true, message: "File deleted successfully" };
		}

		const sharedAccess = await prisma.fileAccess.findFirst({
			where: { fileId, userId },
		});

		if (!sharedAccess) {
			return {
				success: false,
				error: "You do not have access to this file",
			};
		}

		await prisma.fileAccess.deleteMany({
			where: { fileId, userId },
		});

		return {
			success: true,
			message: "Your access to this file has been removed",
		};
	} catch (error) {
		console.error("Error deleting file:", error);
		return { success: false, error: "Failed to delete file" };
	}
};
