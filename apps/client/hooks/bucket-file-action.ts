import axios from "axios";

export const bucketObjectAccess = () => {
	const objectAccess = async (
		bucketField: string,
		isDownload: boolean,
		requestedPermission: string,
		fileId: string,
	) => {
		try {
			if (!isDownload) {
				const cachedData = localStorage.getItem(bucketField);
				console.log("Cached data found in localStorage", cachedData);
				if (cachedData) {
					let cachedObject;

					try {
						cachedObject = JSON.parse(cachedData);
					} catch {
						console.warn("Cached data is not JSON, treating as a plain URL");
						return {
							success: false,
							url: "",
							error: "Invalid cached data format",
						};
					}

					const { url, expiresAt } = cachedObject;

					if (expiresAt && expiresAt > Date.now()) {
						console.log("Using cached URL from localStorage", url);
						return { success: true, url: url };
					} else {
						console.log("Cached URL expired, fetching a new one");
					}
				}
			}

			const timestamp = Date.now();

			const response = await axios.post(
				"http://localhost:3001/api/v1/files/access",
				{ bucketField, isDownload, requestedPermission, timestamp },
				{
					responseType: isDownload ? "json" : "blob",
					withCredentials: true,
					params: { fileId },
				},
			);
			const signedUrl = response.data.url;
			console.log("Signed URL", signedUrl);

			if (!isDownload) {
				const blob = response.data;
				const objectUrl = URL.createObjectURL(blob);

				const expiresIn = 1800 * 1000; // 30 minutes
				const expiresAt = Date.now() + expiresIn;

				localStorage.setItem(
					bucketField,
					JSON.stringify({ url: objectUrl, expiresAt }),
				);
				console.log("Fetched and cached signed URL in localStorage", objectUrl);

				return { success: true, url: objectUrl };
			}

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
		} catch (error) {
			console.error("Error handling file action", error);
			return { success: false, url: "" };
		}
	};

	return { objectAccess };
};
