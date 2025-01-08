import { getVerificationTokenByEmail } from "@/helpers/verification-token";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";
import { getPasswordResetTokenByEmail } from "@/helpers/password-rest-token";

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date()).getTime() + 3600 * 1000; //1 hour

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await prisma.verificationToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const verificationToken = await prisma.verificationToken.create({
		data: {
			email,
			token,
			expiresAt: new Date(expires),
		},
	});

	return verificationToken;
};

export const generatePasswordRestToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date()).getTime() + 3600 * 1000; //1 hour

	const existingToken = await getPasswordResetTokenByEmail(email);

	if (existingToken) {
		await prisma.passwordResetToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const resetToken = await prisma.passwordResetToken.create({
		data: {
			email,
			token,
			expiresAt: new Date(expires),
		},
	});

	return resetToken;
};
