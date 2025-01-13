import { Request, Response } from "express";
import { uploadFile } from "../actions/upload";

export const uploadController = async (req: Request, res: Response) => {
	const files = req.files as Express.MulterS3.File[];
	const { ownerId, accountId } = req.body;

	if (!files || files.length === 0) {
		return res.status(400).json({ error: "No file to upload" });
	}

	if (!ownerId || !accountId) {
		return res
			.status(400)
			.json({ error: "Missing ownerId or accountId in the request body" });
	}

	try {
		const upload = await uploadFile({ files, ownerId, accountId });

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
