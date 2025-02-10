import prisma from "../lib/db";
import { GetFilesProps } from "../type";
import { createQueries } from "./queryFiles";

export const getFiles = async ({
	currentUser,
	type = [],
	searchText = "",
	sort = "date-newest",
	limit = 10,
	cursor,
}: GetFilesProps) => {
	try {
		console.log({ getFiles: { currentUser, type, sort, limit } });
		if (!currentUser) throw new Error("User not found");

		const fetchFiles = async (queryCursor?: string) => {
			const queries = createQueries(currentUser, type, searchText, sort, limit);
			return prisma.file.findMany({
				...queries,
				include: {
					owner: true,
					fileAccess: {
						where: { userId: currentUser.id },
						select: { permissions: true },
					},
				},
				take: limit + 1,
				cursor: queryCursor ? { id: queryCursor } : undefined,
			});
		};

		const files = await fetchFiles(cursor);
		let hasMore = files.length > limit;
		let nextCursor = hasMore ? files[limit].id : null;

		let trimmedFiles = files.slice(0, limit);

		if (!searchText && !hasMore && cursor) {
			const additionalFiles = await fetchFiles(cursor);

			const uniqueFiles = [
				...trimmedFiles,
				...additionalFiles.filter(
					(file) => !trimmedFiles.some((existing) => existing.id === file.id),
				),
			];

			hasMore = uniqueFiles.length > limit;
			nextCursor = hasMore ? uniqueFiles[limit].id : null;

			trimmedFiles = uniqueFiles.slice(0, limit);
		}

		return { success: true, files: trimmedFiles, nextCursor };
	} catch (error) {
		console.error("Error fetching files:", error);
		return { success: false, error: "Error fetching files" };
	}
};
