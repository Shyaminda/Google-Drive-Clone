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
		console.error("Unexpected error in dashboard:", error);
		return { success: false, message: "Internal server error" };
	}
};
