import axios from "axios";

export const fetchFiles = async (type: string, limit?: string) => {
	try {
		const queryParams: Record<string, string> = {};

		if (type) queryParams.type = type;
		if (limit) queryParams.limit = limit;

		const response = await axios.get(`http://localhost:3001/api/v1/files`, {
			params: queryParams,
			withCredentials: true,
		});
		console.log("Response:", response.data.files);
		return response.data.files;
	} catch (error) {
		console.error("Error fetching files:", error);

		throw error;
	}
};
