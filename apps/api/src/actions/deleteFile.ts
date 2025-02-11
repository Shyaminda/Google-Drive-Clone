import { deleteFileInS3 } from "../helpers/deleteObject";
import prisma from "../lib/db";

export const deleteFile = async (userId: string, fileId: string) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			return {
				success: false,
				message: "User not found",
			};
		}

		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			return { success: false, message: "File not found" };
		}

		const isOwner = file.ownerId === userId;

		if (isOwner) {
			const transaction = await prisma.$transaction(async (tx) => {
				try {
					await deleteFileInS3(file.bucketField);
					console.log("File deleted from the s3 bucket");
				} catch (error) {
					console.error("Error deleting file from the s3 bucket", error);
					return {
						success: false,
						message: "Error deleting file from the s3 bucket",
					};
				}

				await tx.fileAccess.deleteMany({ where: { fileId } });
				await tx.file.delete({ where: { id: fileId } });

				await tx.user.update({
					where: { id: userId },
					data: { usedStorage: { decrement: file.size || 0 } },
				});

				return { success: true, message: "File deleted successfully" };
			});

			return transaction;
		}

		const sharedAccess = await prisma.fileAccess.findFirst({
			where: { fileId, userId },
		});

		if (!sharedAccess) {
			return {
				success: false,
				message: "You do not have access to this file",
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
