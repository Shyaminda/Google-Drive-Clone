/* eslint-disable indent */
"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema } from "@repo/types";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
	const validateFields = loginSchema.safeParse(values);

	if (!validateFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password } = validateFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.password || !existingUser.email) {
		return { error: "Email does not exist" };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email,
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
		);

		return { success: "Confirmation email sent!" };
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials" };
				default:
					return { error: "An error occurred" };
			}
		}
		throw error;
	}
};
