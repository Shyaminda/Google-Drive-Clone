import axios from "axios";

export const folderRename = async (folderId: string, newName: string) => {
	try {
		console.log("New Name client:", newName);
		console.log("Folder ID client:", folderId);
		const response = await axios.post(
			"http://localhost:3001/api/v1/folders/rename",
			{ folderId, newName },
			{
				responseType: "json",
				withCredentials: true,
			},
		);
		console.log("Response:", response.data.folder);
	} catch (error) {
		console.error("Error downloading or viewing file:", error);
	}
};
