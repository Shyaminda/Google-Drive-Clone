import { copyFileInS3 } from "../helpers/copyObject";
import { deleteFileInS3 } from "../helpers/deleteObject";
import prisma from "../lib/db";
import { v4 as uuidv4 } from "uuid";
import { Permission } from "@prisma/client";

export const renameFile = async (
	bucketField: string,
	newName: string,
	newExtension?: string,
) => {
	try {
		const file = await prisma.file.findUnique({
			where: { bucketField },
		});

		if (!file) {
			return { success: false, error: "File not found" };
		}

		const currentExtension = file.extension ? `.${file.extension}` : "";
		const isExtensionChanged = newExtension && newExtension !== file.extension;
		console.log("Is Extension Changed:", isExtensionChanged);

		const newNameWithoutExtension = newName.replace(/\.[^/.]+$/, "");

		const finalFileName = newExtension
			? `${newNameWithoutExtension}.${newExtension}`
			: `${newName}`;

		const newKeyParts = bucketField.split("/");
		if (isExtensionChanged) {
			newKeyParts[newKeyParts.length - 1] = `${uuidv4()}.${newExtension}`;
		} else {
			newKeyParts[newKeyParts.length - 1] = `${uuidv4()}${currentExtension}`;
		}
		const newKey = newKeyParts.join("/");

		await copyFileInS3(bucketField, newKey);

		try {
			await deleteFileInS3(bucketField);
		} catch {
			await deleteFileInS3(newKey);
			throw new Error("Failed to delete original file. Rollback applied.");
		}

		try {
			await prisma.file.update({
				where: { bucketField },
				data: {
					name: finalFileName,
					bucketField: newKey,
					extension: newExtension || file.extension,
				},
			});
		} catch (error) {
			console.error("Error updating database", error);
			copyFileInS3(bucketField, newKey);
			await deleteFileInS3(newKey);
			throw new Error("Failed to update database. Rollback applied.");
		}

		console.log("File renamed successfully");
		return { success: true, message: "File renamed successfully" };
	} catch (error) {
		console.error("Error renaming file", error);
		return { success: false, error: "Failed to rename file" };
	}
};

export const shareFile = async (
	fileId: string,
	email: string,
	permissions: string,
) => {
	try {
		const user = await prisma.user.findUnique({ where: { email: email } });

		if (!user) {
			return {
				success: false,
				error: "User not found with the provided email",
			};
		}
		console.log("fileId action:", fileId);

		const userId = user.id;
		console.log("userId action:", userId);

		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file) {
			return { success: false, error: "File not found" };
		}

		const existingAccess = await prisma.fileAccess.findUnique({
			where: { fileId_userId: { fileId, userId: userId } },
		});

		if (existingAccess) {
			return { success: false, error: "User already has access to the file" };
		}

		const validPermissions = permissions.split(",").map((perm) => {
			const trimmedPerm = perm.trim().toUpperCase();
			if (!Object.values(Permission).includes(trimmedPerm as Permission)) {
				throw new Error(`Invalid permission: ${trimmedPerm}`);
			}
			return trimmedPerm as Permission;
		});

		const fileAccess = await prisma.fileAccess.create({
			data: {
				fileId,
				userId: userId,
				permissions: { set: validPermissions },
			},
		});
		return { success: true, fileAccess };
	} catch (error) {
		console.error("Error sharing file:", error);
		return { success: false, error: "Failed to share file" };
	}
};

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
