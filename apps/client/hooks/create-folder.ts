import axios from "axios";

export const createFolder = async (name: string, inType: string) => {
	try {
		const response = await axios.post(
			`http://localhost:3001/api/v1/folders`,
			{
				name,
				inType,
			},
			{ withCredentials: true },
		);
		const createdFolder = response.data;
		return createdFolder;
	} catch (error) {
		console.error("Error creating folder:", error);
	}
};
