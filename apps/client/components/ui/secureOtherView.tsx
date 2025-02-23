/* eslint-disable indent */
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
import { fileExtensions, getOtherMimeType } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const SecureOtherFileView = ({
	url,
	fileName,
	onClose,
}: {
	url: string;
	fileName: string;
	onClose: () => void;
}) => {
	const [mimeType, setMimeType] = useState<string>("");
	const [fileCategory, setFileCategory] = useState("OTHER");
	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const [dimensions] = useState({
		width: 800,
		height: 600,
	});

	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
	const handleDragStart = (e: React.DragEvent) => e.preventDefault();

	useEffect(() => {
		const extractFileInfo = () => {
			const extractedExtension = fileName.split(".").pop()?.toLowerCase() || "";
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
					style={{ width: "100%", height: "60vh" }}
					sandbox="allow-scripts allow-same-origin"
					onContextMenu={handleContextMenu}
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
						style={{ width: "100%", height: "60vh" }}
						sandbox="allow-same-origin"
						onContextMenu={handleContextMenu}
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
					<p className="warning text-center py-4">
						Archives must be downloaded to view contents
					</p>
				);

			case "application/vnd.android.package-archive":
				return (
					<p className="warning text-center py-4">
						APK files cannot be previewed
					</p>
				);

			case "application/x-msdownload":
			case "application/x-msi":
				return (
					<p className="warning text-center py-4">
						Executable files are blocked for security
					</p>
				);

			default:
				return (
					<p className="warning text-center py-4">
						No preview available for this file type
					</p>
				);
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
					maxWidth: "80vw",
					maxHeight: "80vh",
					width: dimensions.width,
					height: dimensions.height,
					boxShadow: "none",
					border: "none",
					padding: "1rem",
				}}
			>
				<DialogHeader className="w-full">
					<DialogTitle className="text-light-300">{fileName}</DialogTitle>
				</DialogHeader>

				<div className="relative flex-1 w-full h-full flex flex-col items-center justify-center">
					<div
						className="secure-file-viewer"
						onContextMenu={handleContextMenu}
						onDragStart={handleDragStart}
					>
						{fileCategory === "OTHER"
							? renderOtherPreview()
							: "Unknown file type"}
					</div>

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

export default SecureOtherFileView;
