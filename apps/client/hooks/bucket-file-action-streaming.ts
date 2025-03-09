import axios from "axios";

export const bucketObjectAccessStreaming = () => {
	const objectAccess = async (
		bucketField: string,
		isDownload: boolean,
		requestedPermission: string,
		fileId: string,
		start = 0,
		end?: number,
	) => {
		try {
			const timestamp = Date.now();
			const CHUNK_SIZE = 1024 * 1024;

			const response = await fetch(
				`http://localhost:3001/api/v1/files/access?fileId=${fileId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Range: `bytes=${start}-${end ?? start + CHUNK_SIZE - 1}`,
					},
					body: JSON.stringify({
						bucketField,
						isDownload,
						requestedPermission,
						timestamp,
					}),
				},
			);
			const stream = response.body;
			const signedUrl = response.url;
			//console.log("Signed URL", signedUrl);
			console.log("stream", stream);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch chunk: ${response.status} ${response.statusText}`,
				);
			}

			if (!isDownload) {
				return { success: true, stream };
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
