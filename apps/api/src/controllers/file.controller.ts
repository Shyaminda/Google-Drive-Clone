import { Request, Response } from "express";
import { uploadFile } from "../actions/upload";
import { AuthenticatedRequest } from "../type";
import { type as PrismaType } from "@prisma/client";
import { getPresignedUrl } from "../actions/getObjectUrl";
import { getExtensionFromFileName } from "../helpers/getExtension";
import { userFilePermission } from "../actions/checkAccessAction";
import { renameFile } from "../actions/renameFile";
import { shareFile } from "../actions/shareFile";
import { updateFileAccess } from "../actions/updateFileAccess";
import { deleteFile } from "../actions/deleteFile";
import { revokeFileAccess } from "../actions/revokeFileAccess";
import { getFiles } from "../actions/getFiles";
import { serializeBigInt } from "../utils/bigIntSerializer";
import { getDashboardData } from "../actions/dashboard";
import { objectViewOnly } from "../actions/getObjectViewOnly";
import { getFile } from "../actions/getFile";

export const dashboardController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const ownerId = req.userId as string;

		if (!ownerId) {
			return res
				.status(200)
				.json({ success: true, message: "Login to view dashboard" });
		}

		const dashboardData = await getDashboardData(ownerId);

		if (!dashboardData.success) {
			return res
				.status(400)
				.json({ success: false, error: dashboardData.message });
		}

		return res.status(200).json(
			serializeBigInt({
				dashboardData,
				message: "Dashboard data fetched successfully",
			}),
		);
	} catch (error) {
		console.error("Unexpected error in dashboardController:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const uploadController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const files = req.files as Express.MulterS3.File[];
	const ownerId = req.userId as string;
	const folderId = req.body.folderId as string;
	console.log(
		"Files upload:",
		files,
		"OwnerId:",
		ownerId,
		"FolderId:",
		folderId,
	);

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
		const upload = await uploadFile({ files, ownerId, folderId });

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
	const { searchText } = req.query;
	const { cursor } = req.query;
	const { sort } = req.query;
	const { folderId } = req.query;
	console.log("Sort controller:", sort);
	console.log("Type controller:", type);
	console.log("Limit controller:", limit);
	console.log("Search Text controller:", searchText);
	console.log("Cursor controller:", cursor);
	console.log("FolderId controller:", folderId);
	const userId = req.userId as string;
	const email = req.email as string;

	if (!userId) {
		return res
			.status(200)
			.json({ success: true, message: "Login to view files" });
	}

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
			sort: sort ? (sort as string) : undefined,
			limit: limit ? parseInt(limit as string) : undefined,
			searchText: typeof searchText === "string" ? searchText : undefined,
			cursor: typeof cursor === "string" ? cursor : undefined,
			folderId: folderId ? (folderId as string) : undefined,
		});

		if (!files.success) {
			return res.status(404).json({ success: false, error: files.error });
		}

		return res.status(200).json(
			serializeBigInt({
				success: true,
				files: files.files,
				nextCursor: files.nextCursor,
			}),
		);
	} catch (error) {
		console.error("Unexpected error in getFilesController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error(gfc)" });
	}
};

export const getFileController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { fileId, type } = req.query;
	const userId = req.userId as string;
	console.log("FileId:", fileId);
	console.log("UserId:", userId);

	if (!fileId) {
		return res.status(400).json({ error: "Missing fileId" });
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

		const file = await getFile({
			userId,
			fileId: fileId as string,
			type: mappedTypes,
		});

		if (!file.success) {
			return res.status(404).json({ error: file.error });
		}

		return res.status(200).json({ file, message: file.message });
	} catch (error) {
		console.error("Unexpected error in getFileController:", error);
		return res.status(500).json({ error: "Internal server error(gfc)" });
	}
};

export const preFileController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { bucketField, isDownload, timestamp } = req.body;
	//const range = req.headers.range;
	console.log("Key:", bucketField);
	console.log("isDownload:", isDownload);
	console.log("Timestamp:", timestamp);
	const userId = req.userId as string;

	if (!userId) {
		return res
			.status(200)
			.json({ success: true, message: "Login to view files" });
	}

	if (!bucketField) {
		return res.status(400).json({ error: "Missing bucketField" });
	}

	try {
		if (isDownload === false) {
			console.log("Streaming file via getObjectViewOnly");
			return objectViewOnly(bucketField, res, timestamp);
		}

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
		return res.status(500).json({ error: "Internal server error(pfc)" });
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
			.json({ success: false, error: "Internal server error(rfc)" });
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
			.json({ success: false, error: "Internal server error(sfac)" });
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
			.json({ success: false, error: "Internal server error(afauc)" });
	}
};

export const deleteFileController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { fileId } = req.query;
	const userId = req.userId;

	try {
		const removeFile = await deleteFile(userId as string, fileId as string);

		if (!removeFile.success) {
			return res.status(400).json({ success: false, error: removeFile.error });
		}

		return res.status(200).json({ success: true, message: removeFile.message });
	} catch (error) {
		console.error("Unexpected error in deleteFileController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error(dfc)" });
	}
};

export const revokeFileAccessController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { email, fileId } = req.body;
	const userId = req.userId;

	if (!email || !fileId) {
		return res
			.status(400)
			.json({ success: false, error: "Missing required fields" });
	}

	try {
		const revokeAccess = await revokeFileAccess(
			email as string,
			userId as string,
			fileId as string,
		);

		if (!revokeAccess.success) {
			return res
				.status(400)
				.json({ success: false, error: revokeAccess.error });
		}

		return res
			.status(200)
			.json({ success: true, message: revokeAccess.message });
	} catch (error) {
		console.error("Unexpected error in revokeFileAccessController:", error);
		return res
			.status(500)
			.json({ success: false, error: "Internal server error(rfac)" });
	}
};
