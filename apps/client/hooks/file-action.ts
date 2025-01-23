import axios from "axios";

export const fileRenameAction = async (
	bucketField: string,
	newName: string,
) => {
	try {
		const response = await axios.post(
			"http://localhost:3001/api/v1/files/rename",
			{ bucketField, newName },
			{
				responseType: "json",
				withCredentials: true,
			},
		);
		console.log("Response:", response.data.file);
	} catch (error) {
		console.error("Error downloading or viewing file:", error);
	}
};
