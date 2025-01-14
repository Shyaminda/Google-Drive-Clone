"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config();

export interface User {
	id: string;
	email: string;
	name: string | null;
	emailVerified: string | null;
	image: string;
	password: string;
	accountId: string | null;
	createdAt: string;
	updatedAt: string;
}

export const useFetchUser = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3001/api/v1/user/authUser`,
					{
						withCredentials: true,
					},
				);
				setUser(response.data.user);
			} catch {
				return { success: false, error: "error fetching user data" };
			}
		};
		fetchUser();
	}, []);
	console.log("userdata", user);

	return { user };
};
