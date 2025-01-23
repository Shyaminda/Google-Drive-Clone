import { copyFileInS3 } from "../helpers/copyObject";
import { deleteFileInS3 } from "../helpers/deleteObject";
import prisma from "../lib/db";
import { v4 as uuidv4 } from "uuid";

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

		const newFileName = newExtension
			? `${newName}.${newExtension}`
			: `${newName}${currentExtension}`;
		const newKeyParts = bucketField.split("/");
		newKeyParts[newKeyParts.length - 1] =
			`${uuidv4()}${newExtension ? `.${newExtension}` : currentExtension}`;
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
					name: newFileName,
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
