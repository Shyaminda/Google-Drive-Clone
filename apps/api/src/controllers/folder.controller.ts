import { Request, Response } from "express";
import { AuthenticatedRequest } from "../type";
import { createFolder } from "../actions/createFolder";
import { getFolders } from "../actions/getFolders";
import { renameFolder } from "../actions/renameFolder";

export const createFolderController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { name, parentId, inType } = req.body;
	const userId = req.userId as string;

	if (!name || !inType) {
		return res.status(400).json({ error: "Required fields missing" });
	}

	try {
		const newFolder = await createFolder(name, userId, inType, parentId);

		if (!newFolder.success) {
			return res.status(500).json({ error: newFolder.error });
		}
		return res
			.status(200)
			.json({ message: newFolder.message, folder: newFolder.newFolder });
	} catch (error) {
		console.error("Error creating folder:", error);
		return res.status(500).json({ error: "Internal server error(cfc)" });
	}
};

export const getFoldersController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { inType, parentId } = req.query;
	const userId = req.userId as string;

	if (!inType) {
		console.error("Type is missing");
	}

	try {
		const folders = await getFolders(
			userId,
			inType as string,
			parentId as string,
		);

		if (!folders.success) {
			return res.status(500).json({ error: folders.error });
		}

		return res
			.status(200)
			.json({ message: folders.message, folders: folders.folders });
	} catch (error) {
		console.error("Error fetching folders:", error);
		return res.status(500).json({ error: "Internal server error(gfc)" });
	}
};

export const renameFolderController = async (req: Request, res: Response) => {
	const { folderId, newName } = req.body;

	if (!folderId || !newName) {
		return res
			.status(400)
			.json({ success: false, error: "Missing folderId or newName" });
	}

	try {
		const result = await renameFolder(folderId, newName);

		if (!result.success) {
			return res.status(400).json({ success: false, error: result.error });
		}

		return res.status(200).json({
			success: true,
			folder: result.folder,
			message: result.message,
		});
	} catch (error) {
		console.error("Unexpected error in renameFolderController:", error);
		return res.status(500).json({
			success: false,
			error: "Internal server error (renameFolderController)",
		});
	}
};
