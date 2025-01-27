import axios from "axios";

export const fileRenameAction = async (
	bucketField: string,
	newName: string,
	fileId: string,
	requestedPermission: string,
) => {
	try {
		console.log("BucketField client:", bucketField);
		console.log("New Name client:", newName);
		console.log("File ID client:", fileId);
		console.log("Requested Permission client:", requestedPermission);
		const response = await axios.post(
			"http://localhost:3001/api/v1/files/rename",
			{ bucketField, newName, requestedPermission },
			{
				responseType: "json",
				withCredentials: true,
				params: { fileId },
			},
		);
		console.log("Response:", response.data.file);
	} catch (error) {
		console.error("Error downloading or viewing file:", error);
	}
};
