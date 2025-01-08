"use server";

import { getUserByEmail } from "@/helpers/user";
import { getVerificationTokenByToken } from "@/helpers/verification-token";
import { prisma } from "@/lib/db";

export const newVerification = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: "Invalid token" };
	}

	const hasExpired = new Date(existingToken.expiresAt) < new Date();

	if (hasExpired) {
		return { error: "Token has expired" };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: "Email not found" };
	}

	await prisma.user.update({
		where: { id: existingUser.id },
		data: { emailVerified: new Date(), email: existingToken.email },
	});

	await prisma.verificationToken.delete({
		where: { id: existingToken.id },
	});

	return { success: "Email verified!" };
};
