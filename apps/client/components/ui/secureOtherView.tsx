/* eslint-disable indent */
import { fileExtensions, getOtherMimeType } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const SecureOtherFileView = ({
	url,
	fileName,
}: {
	url: string;
	fileName: string;
}) => {
	const [mimeType, setMimeType] = useState<string>("");
	const [fileCategory, setFileCategory] = useState("OTHER");

	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
	const handleDragStart = (e: React.DragEvent) => e.preventDefault();

	useEffect(() => {
		const extractFileInfo = () => {
			console.log("Extracting file info", fileName);
			const extractedExtension = fileName.split(".").pop()?.toLowerCase() || "";
			console.log("Extracted extension", extractedExtension);
			const type = getOtherMimeType(extractedExtension);

			setFileCategory(
				fileExtensions.other.includes(extractedExtension) ? "OTHER" : "UNKNOWN",
			);

			setMimeType(type);
		};

		extractFileInfo();

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
	}, [fileName]);

	const renderOtherPreview = () => {
		if (mimeType.startsWith("text/")) {
			return (
				<iframe
					src={url}
					style={{ width: "100%", height: "80vh" }}
					sandbox="allow-scripts allow-same-origin"
				/>
			);
		}

		switch (mimeType) {
			case "application/json":
			case "application/xml":
			case "text/csv":
			case "text/markdown":
			case "text/html":
				return (
					<iframe
						src={url}
						style={{ width: "100%", height: "80vh" }}
						sandbox="allow-same-origin"
					/>
				);

			case "image/x-icon":
				return (
					<Image
						src={url}
						width={50}
						height={50}
						alt="File icon"
						className="icon-preview"
					/>
				);

			case "application/zip":
			case "application/x-rar-compressed":
			case "application/x-tar":
			case "application/gzip":
			case "application/x-bzip2":
			case "application/x-iso9660-image":
				return (
					<p className="warning">
						Archives must be downloaded to view contents
					</p>
				);

			case "application/vnd.android.package-archive":
				return <p className="warning">APK files cannot be previewed</p>;

			case "application/x-msdownload":
			case "application/x-msi":
				return (
					<p className="warning">Executable files are blocked for security</p>
				);

			default:
				return (
					<p className="warning">No preview available for this file type</p>
				);
		}
	};

	return (
		<div
			className="secure-file-viewer"
			onContextMenu={handleContextMenu}
			onDragStart={handleDragStart}
		>
			{fileCategory === "OTHER" ? renderOtherPreview() : "Unknown file type"}
		</div>
	);
};

export default SecureOtherFileView;
