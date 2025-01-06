"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { registerSchema } from "@repo/types";
import { prisma } from "@/lib/db";

export const register = async (values: z.infer<typeof registerSchema>) => {
	const validateFields = registerSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password, name } = validateFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: "User already exists" };
	}

	await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
		},
	});

	return { success: "user created successfully!" };
};
