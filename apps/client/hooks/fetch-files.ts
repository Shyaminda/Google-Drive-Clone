import axios from "axios";

export const fetchFiles = async (
	type?: string,
	limit?: string,
	sort?: string,
	searchText?: string,
	cursor?: string,
	folderId?: string,
) => {
	try {
		const queryParams: Record<string, string> = {};

		if (type) queryParams.type = type;
		if (limit) queryParams.limit = limit;
		if (sort) queryParams.sort = sort;
		if (searchText) queryParams.searchText = searchText;
		if (cursor) queryParams.cursor = cursor;
		if (folderId) queryParams.folderId = folderId;

		console.log("Query params:", queryParams.folderId);

		const response = await axios.get(`http://localhost:3001/api/v1/files`, {
			params: queryParams,
			withCredentials: true,
		});
		console.log("Response data files fetch files:", response.data.files);
		console.log("Response next cursor:", response.data.nextCursor);
		return response.data;
	} catch (error) {
		console.error("Error fetching files:", error);

		throw error;
	}
};
