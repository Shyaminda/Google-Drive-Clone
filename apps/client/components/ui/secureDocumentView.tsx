import { getDocumentMimeType } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const SecureDocumentView = ({
	url,
	fileName,
}: {
	url: string;
	fileName: string;
}) => {
	const [fileType, setFileType] = useState<string>("");

	useEffect(() => {
		const extractedExtension = fileName.split(".").pop()?.toLowerCase() || "";
		const mimeType = getDocumentMimeType(extractedExtension);
		setFileType(mimeType);
	}, [fileName]);

	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === "PrintScreen" ||
				(e.ctrlKey && (e.key === "s" || e.key === "p"))
			) {
				e.preventDefault();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const renderDocumentViewer = () => {
		if (fileType === "application/pdf") {
			return (
				<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
					<Viewer fileUrl={url} />
				</Worker>
			);
		} else if (
			fileType.startsWith("text/") ||
			fileType === "application/json"
		) {
			return (
				<iframe
					src={url}
					style={{ width: "100%", height: "100vh", border: "none" }}
					sandbox="allow-scripts allow-same-origin"
					onContextMenu={handleContextMenu}
				/>
			);
		} else {
			return <p className="warning">No preview available for this file type</p>;
		}
	};

	return (
		<div
			className="secure-file-viewer"
			style={{ position: "relative", width: "100%", height: "100vh" }}
			onContextMenu={handleContextMenu}
		>
			{renderDocumentViewer()}

			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "transparent",
					zIndex: 10,
					cursor: "allowed",
				}}
			/>
		</div>
	);
};

export default SecureDocumentView;
