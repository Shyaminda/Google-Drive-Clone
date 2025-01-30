import axios from "axios";

export const fetchFilePermissions = async (
	fileId: string,
	setPermissions: React.Dispatch<React.SetStateAction<string[]>>,
	setSharedUsers: React.Dispatch<React.SetStateAction<string[]>>,
) => {
	try {
		const response = await axios.get(`http://localhost:3001/api/v1/files/p`, {
			params: {
				fileId,
			},
			responseType: "json",
			withCredentials: true,
		});
		console.log("Response permissions:", response.data);

		const permissionsObject = response.data.fileAccess.permissions;
		const permissionsArray = Object.keys(permissionsObject).filter(
			(key) => permissionsObject[key] === true,
		);

		console.log("Transformed permissions array:", permissionsArray);
		setPermissions(permissionsArray);
		const sharedUsers = response.data.fileAccess.isShared;
		console.log("Shared users permission:", sharedUsers);
		setSharedUsers(sharedUsers);
	} catch (error) {
		console.error("Error fetching file permissions:", error);
	}
};

//TODO: add loading state until the permissions are fetched
