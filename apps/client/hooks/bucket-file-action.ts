import axios from "axios";

export const bucketObjectAction = () => {
	const objectAction = async (bucketField: string, isDownload: boolean) => {
		try {
			const response = await axios.post(
				"http://localhost:3001/api/v1/files/action",
				{ bucketField, isDownload },
				{
					responseType: "json",
					withCredentials: true,
				},
			);
			console.log("Response:", response.data.url);

			if (isDownload) {
				const blob = new Blob([response.data]);
				const url = window.URL.createObjectURL(blob);
				console.log("URL:", url);

				const link = document.createElement("a");
				link.href = url;
				link.download = bucketField.split("/").pop() || "download";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				window.URL.revokeObjectURL(url);

				return { url };
			}
			console.log("Opening URL in new tab:", response.data.url);
			window.open(response.data.url, "_blank");
		} catch (error) {
			console.error("Error downloading or viewing file:", error);
			return { success: false, url: "" };
		}
	};

	return { objectAction };
};
