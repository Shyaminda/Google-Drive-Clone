import { getUserById } from "../helpers/user";

export const loggedUser = async (id: string) => {
	try {
		const user = await getUserById(id);

		if (!user) {
			return { success: false, error: "User not found" };
		}

		return { success: true, user };
	} catch {
		return {
			success: false,
			error: "An error occurred while fetching the user",
		};
	}
};
