import { useState } from "react";
import { fetchFolders } from "@/hooks/fetch-folders";
import { folderProps } from "@/types/types";
import Image from "next/image";

export const Folders = ({
	setShowFolders,
	showFolders,
	inType,
}: folderProps) => {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		if (!showFolders.show) {
			setLoading(true);
			setShowFolders({ show: true, folders: null });
			try {
				const response = await fetchFolders(inType);
				console.log("Fetched folders:", response.folders);

				setShowFolders({
					show: true,
					folders: response.folders,
				});
			} catch (error) {
				console.error("Error fetching folders:", error);
			} finally {
				setLoading(false);
			}
		} else {
			setShowFolders({ show: false, folders: null });
		}
	};

	return (
		<Image
			src="/assets/icons/folder.svg"
			alt="folder"
			width={23}
			height={23}
			className={`h-auto cursor-pointer transition-all hover:scale-110 ease-in-out duration-200 ${loading ? "opacity-50" : ""}`}
			onClick={handleClick}
		/>
	);
};
