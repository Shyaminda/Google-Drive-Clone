import axios from "axios";

export const revokeAccess = async (email: string, fileId: string) => {
	try {
		const revokeAccess = await axios.post(
			"http://localhost:3001/api/v1/files/revoke",
			{
				fileId,
				email,
			},
			{
				withCredentials: true,
			},
		);
		console.log("Response revoke access:", revokeAccess.data);
		return revokeAccess.data;
	} catch (error) {
		console.error("Unexpected error in revokeAccess:", error);
		return { success: false, error: "Internal server error" };
	}
};
