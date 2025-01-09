import { Response } from "express";
import { loggedUser } from "../actions/user";
import { AuthenticatedRequest } from "../type";

export const loggedUserController = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.userId;

	if (!userId) {
		return res.status(400).json({ error: "User ID is missing" });
	}

	const user = await loggedUser(userId);

	if (!user.success) {
		return res.status(404).json({ error: user.error });
	}

	return res.status(200).json(user);
};
