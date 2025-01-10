"use client";

import { useState } from "react";
import { getUserByEmail } from "@/helpers/user";

type User = {
	id: string;
	email: string;
	name: string | null;
	emailVerified: Date | null;
	image: string;
	password: string;
	accountId: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export const GetUserBySession = async (email: string) => {
	try {
		const fetchedUser = await getUserByEmail(email);
		return fetchedUser;
	} catch (error) {
		console.error("Failed to fetch user data:", error);
	}
};
