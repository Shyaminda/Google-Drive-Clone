import axios from "axios";

export const dashboardData = async () => {
	try {
		const dashboardData = await axios.get(
			"http://localhost:3001/api/v1/files/dashboard",
			{
				withCredentials: true,
			},
		);
		console.log("Response dashboard:", dashboardData.data.dashboardData);
		return dashboardData.data.dashboardData;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			console.warn("User is not authenticated, returning default data.");
			return null;
		}
		throw error;
	}
};
