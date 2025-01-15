import { Request, Response } from "express";
import { getFiles, uploadFile } from "../actions/upload";
import { AuthenticatedRequest } from "../type";
import { type as PrismaType } from "@prisma/client";

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

export const getFilesController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const { type } = req.query;
	console.log("Type:", type);
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
