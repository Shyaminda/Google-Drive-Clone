// import prisma from "../lib/db";

// export const bucketFailure = async (key: string) => {
// 	const fileKey = key;
// 	if (fileKey) {
// 		try {
// 			await prisma.file.delete({
// 				where: { bucketField: fileKey },
// 			});
// 			console.log("Database record deleted after S3 failure.");
// 		} catch (dbError) {
// 			console.error(
// 				"Failed to delete database record after S3 failure:",
// 				dbError,
// 			);
// 		}
// 	}

// 	return { success: false, error: "S3 upload failed" };
// };

import prisma from "../lib/db";

export const handleS3Failure = async (file: { key: string }) => {
	try {
		// Attempt to delete file record from the database
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
