import { bucketObjectAccess } from "@/hooks/bucket-file-action";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FileViewerProps {
	bucketField: string;
	fileType: string;
	id: string;
	onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
	bucketField,
	fileType,
	id,
	onClose,
}) => {
	const [fileUrl, setFileUrl] = useState<string | null>(null);

	const { objectAccess } = bucketObjectAccess();

	useEffect(() => {
		async function fetchFile() {
			const { success, url } = await objectAccess(
				bucketField,
				false,
				"VIEW",
				id,
			);
			if (success) setFileUrl(url);
		}

		fetchFile();
	}, [bucketField]);

	return (
		<div className="file-viewer">
			<button onClick={onClose}>Close</button>

			{!fileUrl && <p>Loading...</p>}

			{fileUrl && fileType === "image" && <Image src={fileUrl} alt="Preview" />}
			{fileUrl && fileType === "pdf" && (
				<iframe src={fileUrl} width="100%" height="600px"></iframe>
			)}
			{fileUrl && fileType === "video" && <video src={fileUrl} controls />}
			{fileUrl && fileType === "audio" && <audio src={fileUrl} controls />}
		</div>
	);
};

export default FileViewer;
