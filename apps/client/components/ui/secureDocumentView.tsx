// import { useEffect } from "react";

import { getDocumentMimeType } from "@/utils/utils";
import { useEffect, useState } from "react";

// const SecureDocumentView = ({ url }: { url: string }) => {
// 	console.log("Secure PDF View URL reached", url);

// 	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

// 	useEffect(() => {
// 		const handleKeyDown = (e: KeyboardEvent) => {
// 			if (
// 				e.key === "PrintScreen" ||
// 				(e.ctrlKey && (e.key === "s" || e.key === "p"))
// 			) {
// 				e.preventDefault();
// 				alert("Saving and printing are disabled!");
// 			}
// 		};
// 		document.addEventListener("keydown", handleKeyDown);
// 		return () => document.removeEventListener("keydown", handleKeyDown);
// 	}, []);

// 	return (
// 		<div style={{ position: "relative", width: "100%", height: "100vh" }}>
// 			<iframe
// 				src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}&toolbar=0`}
// 				style={{ width: "100%", height: "100vh", border: "none" }}
// 				onContextMenu={handleContextMenu}
// 			/>

// 			<div
// 				style={{
// 					position: "absolute",
// 					top: 0,
// 					left: 0,
// 					width: "100%",
// 					height: "100%",
// 					background: "transparent",
// 					zIndex: 10,
// 				}}
// 				onContextMenu={handleContextMenu}
// 			/>
// 		</div>
// 	);
// };

// export default SecureDocumentView;

const SecureDocumentView = ({
	url,
	fileName,
}: {
	url: string;
	fileName: string;
}) => {
	const [fileType, setFileType] = useState<string>("");
	console.log("Secure PDF View URL reached", url);

	useEffect(() => {
		// Extract the file extension and determine the MIME type
		const extractedExtension = fileName.split(".").pop()?.toLowerCase() || "";
		const mimeType = getDocumentMimeType(extractedExtension);
		setFileType(mimeType);
		console.log("File type detected:", mimeType);
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
			// Render PDF securely using pdf.js viewer
			return (
				<iframe
					src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}&toolbar=0`}
					style={{ width: "100%", height: "100vh", border: "none" }}
					onContextMenu={handleContextMenu}
				/>
			);
		} else if (
			fileType.startsWith("text/") ||
			fileType === "application/json"
		) {
			// Render text-based files in an iframe
			return (
				<iframe
					src={url}
					style={{ width: "100%", height: "100vh", border: "none" }}
					sandbox="allow-scripts allow-same-origin"
					onContextMenu={handleContextMenu}
				/>
			);
		} else {
			// Default message for unsupported formats
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

			{/* Transparent overlay to block interactions */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "transparent",
					zIndex: 10,
					cursor: "not-allowed",
				}}
				onContextMenu={handleContextMenu}
				onClick={(e) => e.preventDefault()} // Block interaction
			/>
		</div>
	);
};

export default SecureDocumentView;
