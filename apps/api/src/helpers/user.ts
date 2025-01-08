import prisma from "../lib/db";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		return user;
	} catch {
		return {
			success: false,
			error: "An error occurred while fetching the user.",
		};
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		});
		return user;
	} catch {
		return {
			success: false,
			error: "An error occurred while fetching the user.",
		};
	}
};
