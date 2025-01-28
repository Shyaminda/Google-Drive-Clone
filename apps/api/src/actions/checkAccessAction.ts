import prisma from "../lib/db";

export const userFilePermission = async (fileId: string, userId: string) => {
	try {
		const file = await prisma.file.findUnique({
			where: { id: fileId },
			include: { owner: true },
		});
		if (!file) {
			return { success: false, error: "File not found" };
		}
		const isOwner = file.ownerId === userId;
		if (isOwner) {
			return {
				success: true,
				permissions: {
					SHARE: true,
					RENAME: true,
					DELETE: true,
					DOWNLOAD: true,
				},
			};
		}

		const fileAccess = await prisma.fileAccess.findUnique({
			where: { fileId_userId: { fileId, userId } },
			include: { file: true },
		});

		if (!fileAccess) {
			return { success: false, error: "User does not have access to the file" };
		}

		const permissions = fileAccess?.permissions;
		console.log("Permissions check:", permissions);

		if (permissions.includes("SHARE")) {
			return {
				success: true,
				permissions: {
					SHARE: true,
					RENAME: permissions.includes("RENAME"),
					DELETE: permissions.includes("DELETE"),
					DOWNLOAD: permissions.includes("DOWNLOAD"),
				},
			};
		}

		return {
			success: true,
			permissions: {
				SHARE: false,
				RENAME: false,
				DELETE: false,
				DOWNLOAD: false,
			},
		};
	} catch (error) {
		console.error("Error checking user file permission:", error);
		return { success: false, error: "Failed to check user file permission" };
	}
};
