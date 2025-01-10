"use server";

import { signOut } from "@/auth";

export const Logout = async () => {
	await signOut();
};
