"use server";

import { getPasswordResetTokenByToken } from "@/helpers/password-rest-token";
import { getUserByEmail } from "@/helpers/user";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { newPasswordSchema } from "@repo/types";

export const newPassword = async (
	values: z.infer<typeof newPasswordSchema>,
	token?: string | null,
) => {
	if (!token) {
		return { error: "Missing token!" };
	}

	const validatedFields = newPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid Fields!" };
	}

	const { password } = validatedFields.data;

	const existingToken = await getPasswordResetTokenByToken(token);

	if (!existingToken) {
		return { error: "Invalid token!" };
	}

	const hasExpired = new Date(existingToken.expiresAt) < new Date();

	if (hasExpired) {
		return { error: "Token expired!" };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: "Email not found!" };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await prisma.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	await prisma.passwordResetToken.delete({
		where: {
			id: existingToken.id,
		},
	});

	return { success: "Password updated!" };
};
