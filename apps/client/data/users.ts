// import { useEffect, useState } from "react";
// import { getUserByEmail, getUserById } from "@/helpers/user";

// type User = {
// 	id: string;
// 	email: string;
// 	name: string | null;
// 	emailVerified: Date | null;
// 	avatar: string;
// 	password: string;
// 	accountId: string | null;
// 	createdAt: Date;
// 	updatedAt: Date;
// };

// export const GetUserBySession = (email: string) => {
// 	const [userData, setUserData] = useState<User | null>(null);
// 	console.log("userdata", userData);

// 	useEffect(() => {
// 		if (!email) {
// 			console.error("Failed to fetch user: Missing user ID");
// 			return;
// 		}

// 		const fetchUser = async () => {
// 			try {
// 				const fetchedUser = await getUserByEmail(email);
// 				console.log("Fetched user inside fetchUser:", fetchedUser);
// 				setUserData(fetchedUser);
// 				console.log("userData after setting:", userData);
// 			} catch (error) {
// 				console.error("Failed to fetch user data:", error);
// 			}
// 		};

// 		fetchUser();
// 	}, [userData, email]);

// 	return userData;
// };
