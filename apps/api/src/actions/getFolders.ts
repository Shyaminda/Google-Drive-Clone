import prisma from "../lib/db";

export const getFolders = async (
	userId: string,
	inType?: string,
	parentId?: string,
	sort: string = "date-newest",
) => {
	try {
		if (!userId) {
			return { success: false, error: "user not found" };
		}

		const sortOptions: Record<string, { [key: string]: "asc" | "desc" }> = {
			"date-newest": { createdAt: "desc" },
			"date-oldest": { createdAt: "asc" },
			"name-asc": { name: "asc" },
			"name-desc": { name: "desc" },
		};

		const folders = await prisma.folder.findMany({
			where: {
				ownerId: userId,
				inType,
				parentId: parentId ? parentId : null,
			},
			select: {
				id: true,
				name: true,
			},
			orderBy: sortOptions[sort] || { createdAt: "desc" },
		});

		return { success: true, message: "Folders fetched successfully", folders };
	} catch (error) {
		console.error("Error fetching folders:", error);
		return { success: false, error: "Failed to fetch folders" };
	}
};
