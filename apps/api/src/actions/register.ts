import { registerSchema } from "@repo/types";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "../lib/db";

export const register = async (values: z.infer<typeof registerSchema>) => {
	const validateFields = registerSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password, name } = validateFields.data;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
			},
		});

		return { success: true, message: "User created successfully!" };
	} catch {
		return {
			success: false,
			error: "An error occurred while creating the user.",
		};
	}
};
