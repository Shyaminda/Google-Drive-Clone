import { Request, Response } from "express";
import { AuthenticatedRequest } from "../type";
import { createFolder } from "../actions/createFolder";

export const createFolderController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { name, parentId } = req.body;
	const userId = req.userId as string;

	if (!name) {
		return res.status(400).json({ error: "Name is required" });
	}

	try {
		const newFolder = await createFolder(name, userId, parentId);

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
