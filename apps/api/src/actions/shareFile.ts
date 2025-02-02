import { Permission } from "@prisma/client";
import prisma from "../lib/db";

export const shareFile = async (
	fileId: string,
	emails: string[],
	permissions: string[],
	userId: string,
) => {
	const results = [];
	try {
		for (const email of emails) {
			const user = await prisma.user.findUnique({ where: { email: email } });

			if (!user) {
				results.push({
					email,
					success: false,
					error: "User not found with the provided email",
				});
				continue;
			}
			console.log("fileId action:", fileId);

			const accessGrantingUserId = user.id;
			console.log("userId action:", accessGrantingUserId);

			const file = await prisma.file.findUnique({
				where: { id: fileId },
			});

			if (!file) {
				results.push({
					email,
					success: false,
					error: "File not found",
				});
				continue;
			}

			const existingAccess = await prisma.fileAccess.findUnique({
				where: { fileId_userId: { fileId, userId: accessGrantingUserId } },
			});

			if (existingAccess) {
				results.push({
					email,
					success: false,
					error: "This file has already been shared with the user",
				});
				continue;
			}

			const validPermissions = permissions.map((perm) => {
				const trimmedPerm = perm.trim().toUpperCase();
				if (!Object.values(Permission).includes(trimmedPerm as Permission)) {
					throw new Error(`Invalid permission: ${trimmedPerm}`);
				}
				return trimmedPerm as Permission;
			});

			const fileAccess = await prisma.fileAccess.create({
				data: {
					fileId,
					userId: accessGrantingUserId,
					permissions: { set: validPermissions },
					sharedById: userId,
				},
			});
			results.push({
				email,
				success: true,
				fileAccess,
			});
		}
		return { success: true, results };
	} catch (error) {
		console.error("Error sharing file:", error);
		return { success: false, error: "Failed to share file" };
	}
};
