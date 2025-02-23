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
import { fileExtensions, getAudioMimeType } from "@/utils/utils";
import { useEffect, useState } from "react";

const SecureAudioView = ({
	url,
	fileName,
	onClose,
}: {
	url: string;
	fileName: string;
	onClose: () => void;
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(true);

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
					maxWidth: "30vw",
					boxShadow: "none",
					border: "none",
					padding: "1rem",
				}}
			>
				<DialogHeader className="w-full">
					<DialogTitle className="text-light-300 mb-3">{fileName}</DialogTitle>
				</DialogHeader>

				<div className="relative w-full flex items-center justify-center">
					<audio
						controls
						controlsList="nodownload"
						style={{
							maxWidth: "100%",
							width: "400px",
						}}
						onContextMenu={handleContextMenu}
						onDragStart={handleDragStart}
					>
						{fileExtensions.audio.map((ext) => (
							<source key={ext} src={url} type={getAudioMimeType(ext)} />
						))}
					</audio>
				</div>

				<DialogFooter className="flex">
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

export default SecureAudioView;
