import axios from "axios";

export const fileRenameAction = async (FolderId: string, newName: string) => {
	try {
		console.log("New Name client:", newName);
		console.log("Folder ID client:", FolderId);
		const response = await axios.post(
			"http://localhost:3001/api/v1/folders/rename",
			{ FolderId, newName },
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
