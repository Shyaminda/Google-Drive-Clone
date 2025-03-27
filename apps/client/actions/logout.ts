"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const Logout = async () => {
	await signOut();
	try {
		const cookieStore = cookies();

		(await cookieStore).delete("authjs.session-token");
		(await cookieStore).delete("authjs.csrf-token");
		(await cookieStore).delete("authjs.callback-url");

		(await cookieStore).delete("authjs.session-token");

		redirect("/auth/login");
	} catch (error) {
		console.error("Error during sign-out:", error);
	}
};
