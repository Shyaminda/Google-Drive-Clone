"use client";

import { useEffect } from "react";

function cleanUpBlobUrls() {
	Object.keys(localStorage).forEach((key) => {
		const item = localStorage.getItem(key);
		if (item) {
			try {
				const { url } = JSON.parse(item);
				if (url.startsWith("blob:")) {
					URL.revokeObjectURL(url);
					localStorage.removeItem(key);
				}
			} catch (error) {
				console.warn("Skipping invalid localStorage entry:", error);
			}
		}
	});
}

export default function BlobUrlCleanup() {
	useEffect(() => {
		cleanUpBlobUrls();
	}, []);

	return null;
}
