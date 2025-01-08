import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "@/helpers/user";
import { loginSchema } from "@repo/types";
import bcrypt from "bcryptjs";

export default {
	providers: [
		Github({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			async authorize(credentials) {
				const validateFields = loginSchema.safeParse(credentials);

				if (validateFields.success) {
					const { email, password } = validateFields.data;

					const user = await getUserByEmail(email);
					if (!user || !user.password) return null; //here it check if there is a user or there is a user without a password //this prevents users form using credentials provider who are logged in using google or other OAuth providers where they do not have a password in order to credential provider to work we need a password

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (passwordsMatch) {
						return user;
					}
				}
				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
