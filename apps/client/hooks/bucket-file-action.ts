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
			const signedUrl = response.data.url;
			console.log("Signed URL", signedUrl);

			if (isDownload) {
				const fileResponse = await axios.get(signedUrl, {
					responseType: "blob",
				});
				console.log("File Response", fileResponse);

				const blob = new Blob([fileResponse.data]);
				const url = window.URL.createObjectURL(blob);

				const link = document.createElement("a");
				link.href = url;
				link.download = bucketField.split("/").pop() || "download";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				window.URL.revokeObjectURL(url);

				return { success: true, url };
			} else {
				console.log("Opening URL", signedUrl);
				window.open(signedUrl, "_blank");
			}
		} catch (error) {
			console.error("Error handling file action", error);
			return { success: false, url: "" };
		}
	};

	return { objectAction };
};
