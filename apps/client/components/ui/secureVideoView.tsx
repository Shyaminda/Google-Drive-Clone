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
import { fileExtensions, getVideoMimeType } from "@/utils/utils";
import { useEffect, useState } from "react";

const SecureVideoView = ({
	url,
	fileName,
	onClose,
}: {
	url: string;
	fileName: string;
	onClose: () => void;
}) => {
	const [videoDimensions, setVideoDimensions] = useState({
		width: 800,
		height: 600,
	});
	const [isDialogOpen, setIsDialogOpen] = useState(true);

	useEffect(() => {
		const video = document.createElement("video");
		video.src = url;

		video.onloadedmetadata = () => {
			const maxWidth = window.innerWidth * 0.8;
			const maxHeight = window.innerHeight * 0.8;
			let width = video.videoWidth;
			let height = video.videoHeight;
			const aspectRatio = width / height;

			if (width > maxWidth || height > maxHeight) {
				if (aspectRatio > 1) {
					width = maxWidth;
					height = maxWidth / aspectRatio;
				} else {
					height = maxHeight;
					width = maxHeight * aspectRatio;
				}
			}

			setVideoDimensions({ width, height });
		};
	}, [url]);

	const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
	const handleDragStart = (e: React.DragEvent) => e.preventDefault();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === "PrintScreen" ||
				(e.ctrlKey && (e.key === "s" || e.key === "p"))
			) {
				e.preventDefault();
				alert("Saving and printing are disabled!");
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

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
					maxHeight: "50vh",
					width: videoDimensions.width,
					height: videoDimensions.height,
					boxShadow: "none",
					border: "none",
					padding: "1rem",
				}}
			>
				<DialogHeader className="w-full">
					<DialogTitle className="text-light-300">{fileName}</DialogTitle>
				</DialogHeader>

				<div className="relative flex-1 w-full flex items-center justify-center">
					<video
						controls
						controlsList="nodownload"
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							aspectRatio: videoDimensions.width / videoDimensions.height,
						}}
						onContextMenu={handleContextMenu}
						onDragStart={handleDragStart}
					>
						{fileExtensions.video.map((ext) => (
							<source key={ext} src={url} type={getVideoMimeType(ext)} />
						))}
					</video>
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

export default SecureVideoView;
