import { Request, Response } from "express";
import { getFiles, uploadFile } from "../actions/upload";
import { AuthenticatedRequest } from "../type";
import { type as PrismaType } from "@prisma/client";
import { getPresignedUrl } from "../actions/getObjectUrl";
import { renameFile, shareFile, updateFileAccess } from "../actions/fileAction";
import { getExtensionFromFileName } from "../helpers/getExtension";
import { userFilePermission } from "../actions/checkAccessAction";

export const uploadController = async (req: Request, res: Response) => {
	const files = req.files as Express.MulterS3.File[];
	const { ownerId } = req.body;
	console.log("Files:", files, "OwnerId:", ownerId);

	if (!files || files.length === 0) {
		return res.status(400).json({ error: "No file to upload" });
	}

	if (!ownerId) {
		return res
			.status(400)
			.json({ error: "Missing ownerId in the request body" });
	}

	try {
		console.log("reached here");
		const upload = await uploadFile({ files, ownerId });

		if (!upload || !upload.success) {
			return res.status(400).json({ error: upload?.error });
		}

		return res
			.status(200)
			.json({ upload, message: "Files uploaded successfully" });
	} catch (error) {
		console.error("Unexpected error in uploadController:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getFilesController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { type } = req.query;
	const { limit } = req.query;
	console.log("Type:", type);
	console.log("Limit:", limit);
	const userId = req.userId as string;
	const email = req.email as string;

	if (!type) {
		return res
			.status(400)
			.json({ success: false, error: "No criteria provided to fetch files" });
	}

	try {
		const validTypes = Object.values(PrismaType);
		console.log("Valid Types:", validTypes);

		const mappedTypes = Array.isArray(type)
			? type
					.filter((t) => validTypes.includes(t as PrismaType))
					.map((t) => t as PrismaType)
			: validTypes.includes(type as PrismaType)
				? [type as PrismaType]
				: [];

		console.log("Mapped Types:", mappedTypes);

		const files = await getFiles({
			currentUser: { id: userId, email: email },
			type: mappedTypes,
			sort: "desc",
			limit: limit ? parseInt(limit as string) : undefined,
		});

		if (!files.success) {
			return res.status(404).json({ success: false, error: files.error });
		}

		return res.status(200).json({ success: true, files: files.files });
	} catch (error) {
		console.error("Unexpected error in getFilesController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error" });
	}
};

export const preFileController = async (req: Request, res: Response) => {
	const { bucketField, isDownload } = req.body;
	console.log("Key:", bucketField);
	console.log("isDownload:", isDownload);

	if (!bucketField) {
		return res.status(400).json({ error: "Missing bucketField" });
	}

	try {
		const { success, url, error } = await getPresignedUrl(
			bucketField,
			isDownload === "false",
		);

		if (!success || !url) {
			console.error("Error from getPresignedUrl:", error);
			return res
				.status(400)
				.json({ error: error || "Failed to generate pre-signed URL" });
		}

		console.log("Fetched URL successfully:", url);
		return res.status(200).json({ url, message: "Fetched URL successfully" });
	} catch (error) {
		console.error("Unexpected error in preFileController:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const renameFileController = async (req: Request, res: Response) => {
	const { bucketField, newName } = req.body;

	if (!bucketField || !newName) {
		return res
			.status(400)
			.json({ success: false, error: "Missing bucketField or newName" });
	}

	try {
		const newExtension = getExtensionFromFileName(newName);
		console.log("New Extension con:", newExtension);

		const file = await renameFile(bucketField, newName, newExtension);

		if (!file.success) {
			return res.status(400).json({ success: false, error: file.error });
		}

		return res.status(200).json({ file, message: "File renamed successfully" });
	} catch (error) {
		console.error("Unexpected error in renameController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error" });
	}
};

export const fileAccessPermissionController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { fileId } = req.query;
	const userId = req.userId;
	console.log("userId permission:", userId);
	console.log("fileId permission:", fileId);

	if (!fileId || !userId) {
		return res
			.status(400)
			.json({ success: false, error: "Missing required fields" });
	}

	const fileAccess = await userFilePermission(fileId as string, userId);

	if (!fileAccess.success) {
		return res.status(400).json({ success: false, error: fileAccess.error });
	}
	console.log("File Access check:", fileAccess);
	return res.status(200).json({ fileAccess, message: "File access checked" });
};

export const shareFileAccessController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { grantPermissions, emails } = req.body;
	const { fileId } = req.query;
	const userId = req.userId;
	console.log("FileId:", fileId);
	console.log("Email:", emails);
	console.log("permissions:", grantPermissions);
	console.log("email:", emails);

	if (!fileId || !emails || !grantPermissions) {
		return res
			.status(400)
			.json({ success: false, error: "Missing required fields" });
	}

	let emailArray: string[];
	if (typeof emails === "string") {
		emailArray = emails.split(",").map((email) => email.trim());
	} else if (Array.isArray(emails)) {
		emailArray = emails;
	} else {
		return res
			.status(400)
			.json({ success: false, error: "Invalid format for emails" });
	}

	let permissionArray: string[];
	if (typeof grantPermissions === "string") {
		permissionArray = grantPermissions
			.split(",")
			.map((permission) => permission.trim());
	} else if (Array.isArray(grantPermissions)) {
		permissionArray = grantPermissions;
	} else {
		return res
			.status(400)
			.json({ success: false, error: "Invalid format for permissions" });
	}

	try {
		const sharedUser = await shareFile(
			fileId as string,
			emailArray,
			permissionArray,
			userId as string,
		);

		if (!sharedUser.success) {
			return res.status(400).json({ success: false, error: sharedUser.error });
		}

		return res
			.status(200)
			.json({ sharedUser, message: "File shared successfully" });
	} catch (error) {
		console.error("Unexpected error in shareFileAccessController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error" });
	}
};

export const shareFileAccessUpdateController = async (
	req: Request,
	res: Response,
) => {
	const { fileId, ownerId, email, newAccessLevel } = req.body;

	if (!fileId || !ownerId || !email || !newAccessLevel) {
		return res
			.status(400)
			.json({ success: false, error: "Missing required fields" });
	}

	try {
		const updateSharedUser = await updateFileAccess(
			fileId,
			ownerId,
			email,
			newAccessLevel,
		);

		if (!updateSharedUser.success) {
			return res
				.status(400)
				.json({ success: false, error: updateSharedUser.error });
		}

		return res
			.status(200)
			.json({ updateSharedUser, message: "File shared successfully" });
	} catch (error) {
		console.error("Unexpected error in shareFileAccessController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error" });
	}
};
