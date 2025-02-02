import prisma from "../lib/db";

export const revokeFileAccess = async (
	email: string,
	userId: string,
	fileId: string,
) => {
	try {
		const accessRevokingUser = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!accessRevokingUser) {
			return {
				success: false,
				error: "User not found with the provided email",
			};
		}

		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			return {
				success: false,
				error: "File not found",
			};
		}

		const isOwner = file.ownerId === userId;

		if (isOwner) {
			await prisma.fileAccess.deleteMany({
				where: {
					fileId,
					userId: accessRevokingUser.id,
				},
			});

			await prisma.fileAccess.deleteMany({
				where: { fileId, sharedById: accessRevokingUser.id },
			});

			return {
				success: true,
				message: "Access revoked successfully as owner",
			};
		}

		const existingAccess = await prisma.fileAccess.findFirst({
			where: {
				fileId,
				userId: accessRevokingUser.id,
				sharedById: userId,
			},
		});

		if (!existingAccess) {
			return {
				success: false,
				error: "No access record found or insufficient permissions",
			};
		}

		await prisma.fileAccess.deleteMany({
			where: { fileId, userId: accessRevokingUser.id },
		});

		await prisma.fileAccess.deleteMany({
			where: { fileId, sharedById: accessRevokingUser.id },
		});

		return { success: true, message: "Access revoked successfully" };
	} catch (error) {
		console.error("Unexpected error in revokeFileAccess:", error);
		return { success: false, error: "Internal server error" };
	}
};
