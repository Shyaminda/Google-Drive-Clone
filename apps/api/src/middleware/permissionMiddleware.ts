import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../type";
import prisma from "../lib/db";
import { Permission } from "@prisma/client";

export const checkFilePermission = () => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const { fileId } = req.query;
		const { requestedPermission } = req.body;
		console.log("Requested Permission middleware:", requestedPermission);
		const currentUser = req.userId;

		console.log("File ID:", fileId);

		if (!fileId) {
			res.status(400).json({ error: "File ID is not available" });
			return;
		}

		if (!currentUser) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		try {
			const file = await prisma.file.findUnique({
				where: { id: fileId as string },
				include: {
					owner: true,
					fileAccess: true,
				},
			});

			if (!file) {
				res.status(404).json({ error: "File not found" });
				return;
			}

			if (file.ownerId === currentUser) {
				console.log("Owner reached");
				return next();
			}

			const userAccess = file.fileAccess.find(
				(access) => access.userId === currentUser,
			);

			if (!userAccess) {
				res.status(403).json({ error: "Access Denied" });
				return;
			}

			if (!userAccess.permissions.includes(requestedPermission as Permission)) {
				res
					.status(403)
					.json({ error: `Permission to ${requestedPermission} denied` });
				return;
			}

			next();
		} catch (error) {
			console.error("Error checking file permission:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	};
};
