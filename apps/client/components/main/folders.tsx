import { useState } from "react";
import { fetchFolders } from "@/hooks/fetch-folders";
import { folderProps } from "@/types/types";
import Image from "next/image";

export const Folders = ({
	setShowFolders,
	showFolders,
	inType,
	folderId,
}: folderProps) => {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		if (!showFolders.show) {
			console.log("Fetching folders reached...");
			setLoading(true);
			setShowFolders({ show: true, folders: null });
			try {
				const response = await fetchFolders(inType, folderId);
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
		<div
			onClick={() => !loading && handleClick()}
			className={`cursor-pointer transition-all hover:scale-110 ease-in-out duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
		>
			<Image
				src="/assets/icons/folder.svg"
				alt="folder"
				width={23}
				height={23}
				className="h-auto"
			/>
		</div>
	);
};
