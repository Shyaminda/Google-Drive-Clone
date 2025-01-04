import { Request, Response } from "express";
import { register } from "../actions/register";

export const registerController = async (req: Request, res: Response) => {
	const { email, password, name } = req.body;

	const createUser = await register({ email, password, name });

	if (!createUser.success) {
		return res.status(400).json({ error: createUser.error });
	}

	return res.status(201).json({ message: createUser.message });
};
