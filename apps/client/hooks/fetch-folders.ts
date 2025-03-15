import axios from "axios";

export const fetchFolders = async (inType: string, parentId?: string) => {
	console.log("Fetching folders...", inType);
	try {
		const response = await axios.get(`http://localhost:3001/api/v1/folders`, {
			params: { inType, parentId },
			withCredentials: true,
		});
		console.log("Response data hook:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching folders:", error);

		throw error;
	}
};
