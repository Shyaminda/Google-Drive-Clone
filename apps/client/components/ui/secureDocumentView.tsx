// import { getDocumentMimeType } from "@/utils/utils";
// import { useEffect, useState } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";

// const SecureDocumentView = ({
// 	url,
// 	fileName,
// }: {
// 	url: string;
// 	fileName: string;
// }) => {
// 	const [fileType, setFileType] = useState<string>("");

// 	useEffect(() => {
// 		const extractedExtension = fileName.split(".").pop()?.toLowerCase() || "";
// 		const mimeType = getDocumentMimeType(extractedExtension);
// 		setFileType(mimeType);
// 	}, [fileName]);

// 	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

// 	useEffect(() => {
// 		const handleKeyDown = (e: KeyboardEvent) => {
// 			if (
// 				e.key === "PrintScreen" ||
// 				(e.ctrlKey && (e.key === "s" || e.key === "p"))
// 			) {
// 				e.preventDefault();
// 			}
// 		};
// 		document.addEventListener("keydown", handleKeyDown);
// 		return () => document.removeEventListener("keydown", handleKeyDown);
// 	}, []);

// 	const renderDocumentViewer = () => {
// 		if (fileType === "application/pdf") {
// 			return (
// 				<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
// 					<Viewer fileUrl={url} />
// 				</Worker>
// 			);
// 		} else if (
// 			fileType.startsWith("text/") ||
// 			fileType === "application/json"
// 		) {
// 			return (
// 				<iframe
// 					src={url}
// 					style={{ width: "100%", height: "100vh", border: "none" }}
// 					sandbox="allow-scripts allow-same-origin"
// 					onContextMenu={handleContextMenu}
// 				/>
// 			);
// 		} else {
// 			return <p className="warning">No preview available for this file type</p>;
// 		}
// 	};

// 	return (
// 		<div
// 			className="secure-file-viewer"
// 			style={{ position: "relative", width: "100%", height: "100vh" }}
// 			onContextMenu={handleContextMenu}
// 		>
// 			{renderDocumentViewer()}

// 			<div
// 				style={{
// 					position: "absolute",
// 					top: 0,
// 					left: 0,
// 					width: "100%",
// 					height: "100%",
// 					background: "transparent",
// 					zIndex: 10,
// 					cursor: "allowed",
// 				}}
// 			/>
// 		</div>
// 	);
// };

// export default SecureDocumentView;

"use client";

import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/dialog";
import { getDocumentMimeType } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const SecureDocumentView = ({
	url,
	fileName,
	onClose,
}: {
	url: string;
	fileName: string;
	onClose: () => void;
}) => {
	const [fileType, setFileType] = useState<string>("");
	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const [dimensions, setDimensions] = useState({
		width: 800,
		height: 600,
	});

	useEffect(() => {
		const extractedExtension = fileName.split(".").pop()?.toLowerCase() || "";
		const mimeType = getDocumentMimeType(extractedExtension);
		setFileType(mimeType);

		const maxWidth = window.innerWidth * 0.8;
		const maxHeight = window.innerHeight * 0.8;
		setDimensions({
			width: maxWidth,
			height: maxHeight,
		});
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
					style={{ width: "100%", height: "100%", border: "none" }}
					sandbox="allow-scripts allow-same-origin"
					onContextMenu={handleContextMenu}
				/>
			);
		} else {
			return <p className="warning">No preview available for this file type</p>;
		}
	};

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(open) => {
				setIsDialogOpen(open);
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="flex flex-col items-center"
				style={{
					backgroundColor: "transparent",
					maxWidth: "50vw",
					maxHeight: "90vh",
					width: dimensions.width,
					height: dimensions.height,
					boxShadow: "none",
					border: "none",
					padding: "1.5rem",
				}}
			>
				<DialogHeader className="w-full">
					<DialogTitle className="text-light-300 mb-2">{fileName}</DialogTitle>
				</DialogHeader>

				<div className="relative flex-1 w-full h-full">
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
							pointerEvents: "none",
						}}
					/>
				</div>

				<DialogFooter className="flex justify-end">
					<DialogClose asChild>
						<Button
							onClick={onClose}
							variant="view"
							className="px-4 py-2 rounded-md"
						>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SecureDocumentView;

//Todo: add thumbnail urls to localstorage
