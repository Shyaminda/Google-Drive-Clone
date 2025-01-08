"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/helpers/user";
import { registerSchema } from "@repo/types";
import { prisma } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof registerSchema>) => {
	const validateFields = registerSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password, name } = validateFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: "User already exists!" };
	}

	await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
		},
	});

	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(verificationToken.email, verificationToken.token);

	return { success: "Confirmation email sent!" };
};
