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

	useEffect(() => {
		async function fetchFile() {
			const { success, url } = await objectAccess(
				bucketField,
				false,
				"VIEW",
				id,
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
			{!fileUrl && <p>Loading...</p>}

			{fileUrl && fileType === "IMAGE" && (
				<SecureImageView url={fileUrl} fileName={fileName} onClose={onClose} />
			)}

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

//TODO: when close is click terminate the file retrieval process any further
