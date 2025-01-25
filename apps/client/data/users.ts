"use client";

import { getUserByEmail } from "@/helpers/user";

export const GetUserBySession = async (email: string) => {
	try {
		const fetchedUser = await getUserByEmail(email);
		return fetchedUser;
	} catch (error) {
		console.error("Failed to fetch user data:", error);
	}
};
