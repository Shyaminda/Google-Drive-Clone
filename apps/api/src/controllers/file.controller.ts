import { Request, Response } from "express";
import { uploadFile } from "../actions/upload";

export const uploadController = async (req: Request, res: Response) => {
	const { file } = req;
	const { ownerId, accountId } = req.body;

	if (!file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	if (!ownerId || !accountId) {
		return res
			.status(400)
			.json({ error: "Missing ownerId or accountId in the request body" });
	}

	try {
		const upload = await uploadFile({ file, ownerId, accountId });

		if (!upload.success) {
			return res.status(400).json({ error: upload.error });
		}

		return res.status(200).json(upload);
	} catch (error) {
		console.error("Unexpected error in uploadController:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
