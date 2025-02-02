import { Permission } from "@prisma/client";
import prisma from "../lib/db";

export const updateFileAccess = async (
	fileId: string,
	ownerId: string,
	email: string,
	newPermission: string,
) => {
	try {
		const user = await prisma.user.findUnique({ where: { email: email } });

		if (!user) {
			return {
				success: false,
				error: "User not found with the provided email",
			};
		}

		const userId = user.id;

		const file = await prisma.file.findFirst({
			where: { id: fileId, ownerId },
		});

		if (!file) {
			return { success: false, error: "File not found or access denied" };
		}

		const updatedAccess = await prisma.fileAccess.updateMany({
			where: { fileId, userId: userId },
			data: { permissions: { set: [newPermission as Permission] } },
		});

		if (updatedAccess.count === 0) {
			return { success: false, error: "No access record found for the user" };
		}

		return { success: true, updatedAccess };
	} catch (error) {
		console.error("Error updating file access:", error);
		return { success: false, error: "Failed to update file access" };
	}
};
