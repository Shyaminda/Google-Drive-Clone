import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";

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
