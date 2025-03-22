import axios from "axios";

export const fetchFile = async (fileId: string, type: string) => {
	try {
		const response = await axios.get(
			`http://localhost:3001/api/v1/files/file`,
			{
				params: { fileId, type },
				withCredentials: true,
			},
		);
		console.log("Response data files fetch files:", response.data.file);
		return response.data;
	} catch (error) {
		console.error("Error fetching files:", error);

		throw error;
	}
};
