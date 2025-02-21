import { bucketObjectAccess } from "@/hooks/bucket-file-action";
import { FileViewerProps } from "@/types/types";
import { useEffect, useState } from "react";
import SecureImageView from "./secureImageView";
import SecureDocumentView from "./secureDocumentView";
import SecureVideoView from "./secureVideoView";
import SecureAudioView from "./secureAudioView";
import SecureOtherFileView from "./secureOtherView";

const FileViewer: React.FC<FileViewerProps> = ({
	bucketField,
	fileType,
	id,
	fileName,
	onClose,
}) => {
	const [fileUrl, setFileUrl] = useState<string | null>(null);

	const { objectAccess } = bucketObjectAccess();

	const isImage = fileType === "IMAGE";

	useEffect(() => {
		async function fetchFile() {
			const { success, url } = await objectAccess(
				bucketField,
				false,
				"VIEW",
				id,
				isImage,
			);
			console.log("File URL file viewer", url);
			if (success) {
				setFileUrl(url);
			}
		}

		fetchFile();
	}, [bucketField, id]);

	console.log(
		"Rendering FileViewer - fileType:",
		fileType,
		"fileUrl:",
		fileUrl,
	);

	return (
		<div className="file-viewer">
			<button onClick={onClose}>Close</button>

			{!fileUrl && <p>Loading...</p>}

			{fileUrl && fileType === "IMAGE" && <SecureImageView url={fileUrl} />}

			{fileUrl && fileType === "DOCUMENT" && (
				<SecureDocumentView url={fileUrl} fileName={fileName} />
			)}
			{fileUrl && fileType === "VIDEO" && <SecureVideoView url={fileUrl} />}
			{fileUrl && fileType === "AUDIO" && <SecureAudioView url={fileUrl} />}
			{fileUrl && fileType === "OTHER" && (
				<SecureOtherFileView url={fileUrl} fileName={fileName} />
			)}
		</div>
	);
};

export default FileViewer;
