"use server";

import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generatePasswordRestToken } from "@/lib/tokens";
import { resetSchema } from "@repo/types";
import { z } from "zod";

export const reset = async (values: z.infer<typeof resetSchema>) => {
	const validatedFields = resetSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid email!" };
	}

	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: "Email not found!" };
	}

	const passwordRestToken = await generatePasswordRestToken(email);
	await sendResetPasswordEmail(
		passwordRestToken.email,
		passwordRestToken.token,
	);
	return { success: "Reset link sent!" };
};
