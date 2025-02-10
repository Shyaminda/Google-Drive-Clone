import { Prisma } from "@prisma/client";
import { type as PrismaType } from "@prisma/client";

export const createQueries = (
	currentUser: { id: string; email: string },
	type: string[],
	searchText: string,
	sort: string,
	limit?: number,
): Prisma.FileFindManyArgs => {
	const where: Prisma.FileWhereInput = {
		AND: [
			{
				OR: [
					{ ownerId: currentUser.id },
					{ fileAccess: { some: { userId: currentUser.id } } },
					{ user: { has: currentUser.email } },
				],
			},
			type.length > 0 ? { type: { in: type.map((t) => t as PrismaType) } } : {},
			searchText
				? {
						OR: searchText.split(" ").map((word) => ({
							name: { contains: word, mode: "insensitive" },
						})),
					}
				: {},
		],
	};

	const orderBy: Prisma.FileOrderByWithRelationInput[] = [];
	if (sort) {
		switch (sort) {
			case "name-asc":
				orderBy.push({ name: "asc" });
				break;
			case "name-desc":
				orderBy.push({ name: "desc" });
				break;
			case "date-newest":
				orderBy.push({ createdAt: "desc" });
				break;
			case "date-oldest":
				orderBy.push({ createdAt: "asc" });
				break;
			case "size-largest":
				orderBy.push({ size: "desc" });
				break;
			case "size-smallest":
				orderBy.push({ size: "asc" });
				break;
			default:
				orderBy.push({ createdAt: "desc" });
				break;
		}
	}

	return {
		where,
		...(orderBy.length > 0 && { orderBy }),
		...(limit && { take: limit }),
	};
};
