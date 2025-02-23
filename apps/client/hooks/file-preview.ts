import { useState } from "react";
import { viewOnlyProps } from "@/types/types";

export function useFilePreview() {
	const [selectedViewFile, setSelectedViewFile] =
		useState<viewOnlyProps | null>(null);

	const handleFileClick = (
		id: string,
		bucketField: string,
		type: string,
		name: string,
	) => {
		console.log("File clicked:", name);
		setSelectedViewFile({ id, bucketField, type, name });
	};

	const closePreview = () => {
		console.log("Closing preview...");
		setSelectedViewFile(null);
	};

	return { selectedViewFile, handleFileClick, closePreview };
}
