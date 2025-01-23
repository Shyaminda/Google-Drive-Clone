import prisma from "../lib/db";

export const handleS3Failure = async (file: { key: string }) => {
	try {
		await prisma.file.deleteMany({
			where: { bucketField: file?.key },
		});
		console.log("Database record deleted after S3 failure.");
	} catch (dbError) {
		console.error(
			"Failed to delete database record after S3 failure:",
			dbError,
		);
	}
};
