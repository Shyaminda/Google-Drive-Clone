import axios from "axios";

export const deleteFolder = async (folderId: string) => {
	try {
		const response = await axios.delete(
			`http://localhost:3001/api/v1/folders`,
			{
				params: {
					folderId,
				},
				withCredentials: true,
			},
		);
		console.log("Response delete file:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error deleting file:", error);
	}
};
