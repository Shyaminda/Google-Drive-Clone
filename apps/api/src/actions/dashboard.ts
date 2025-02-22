import prisma from "../lib/db";

export const getDashboardData = async (ownerId: string) => {
	try {
		if (!ownerId) {
			return { success: false, message: "user not found" };
		}

		const user = await prisma.user.findUnique({
			where: { id: ownerId },
			select: { usedStorage: true, maxStorage: true },
		});

		if (!user) {
			return { success: false, message: "User not found" };
		}

		const usedPercentage =
			user.maxStorage > 0
				? Number((BigInt(user.usedStorage) * 100n) / BigInt(user.maxStorage))
				: 0;

		const recentFiles = await prisma.file.findMany({
			where: { ownerId: ownerId },
			orderBy: { createdAt: "desc" },
			take: 10,
			select: {
				id: true,
				name: true,
				type: true,
				size: true,
				createdAt: true,
				bucketField: true,
				extension: true,
			},
		});

		const fileSummary = await prisma.file.groupBy({
			by: ["type"],
			where: { ownerId: ownerId },
			_sum: { size: true },
		});

		const lastCreatedFile = await prisma.file.findMany({
			where: { ownerId: ownerId },
			orderBy: { createdAt: "desc" },
			select: {
				type: true,
				createdAt: true,
			},
		});

		const getLatestFileDate = (fileType: string) => {
			const file = lastCreatedFile.find((f) => f.type === fileType);
			return file ? file.createdAt : null;
		};

		const summary = {
			Documents: {
				size: fileSummary.find((f) => f.type === "DOCUMENT")?._sum?.size || 0,
				latestDate: getLatestFileDate("DOCUMENT"),
			},
			Videos: {
				size: fileSummary.find((f) => f.type === "VIDEO")?._sum?.size || 0,
				latestDate: getLatestFileDate("VIDEO"),
			},
			Audios: {
				size: fileSummary.find((f) => f.type === "AUDIO")?._sum?.size || 0,
				latestDate: getLatestFileDate("AUDIO"),
			},
			Images: {
				size: fileSummary.find((f) => f.type === "IMAGE")?._sum?.size || 0,
				latestDate: getLatestFileDate("IMAGE"),
			},
			Others: {
				size: fileSummary
					.filter(
						(f) => !["DOCUMENT", "VIDEO", "AUDIO", "IMAGE"].includes(f.type),
					)
					.reduce((sum, f) => sum + (f._sum?.size || 0), 0), // Sum up other types
				latestDate: getLatestFileDate("OTHER"),
			},
		};

		return {
			success: true,
			maxStorage: user.maxStorage,
			usedStorage: user.usedStorage,
			usedPercentage,
			recentFiles,
			summary,
		};
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return { success: false, message: "Error fetching dashboard data" };
	}
};
