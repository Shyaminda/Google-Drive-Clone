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
import Image from "next/image";
import { useEffect, useState } from "react";

const SecureImageView = ({
	url,
	fileName,
	onClose,
}: {
	url: string;
	fileName: string;
	onClose: () => void;
}) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [zoom, setZoom] = useState(1);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [imageSize, setImageSize] = useState({ width: 500, height: 500 });

	useEffect(() => {
		if (!url) return;

		const img = new window.Image();
		img.src = url;
		img.onload = () => {
			const maxWidth = window.innerWidth * 0.7;
			const maxHeight = window.innerHeight * 0.7;
			let width = img.width;
			let height = img.height;
			const aspectRatio = img.width / img.height;

			if (width > maxWidth || height > maxHeight) {
				if (aspectRatio > 1) {
					width = maxWidth;
					height = maxWidth / aspectRatio;
				} else {
					height = maxHeight;
					width = maxHeight * aspectRatio;
				}
			}
			setImageSize({ width, height });
			setImageUrl(url);
		};

		setIsDialogOpen(true);
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
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleWheel = (e: React.WheelEvent) => {
		const scaleFactor = 1.05;
		const newZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
		setZoom(Math.min(Math.max(newZoom, 1), 3));

		if (newZoom <= 1) {
			setOffsetX(0);
			setOffsetY(0);
		}
	};

	const handleZoomIn = () => {
		setZoom((prevZoom) => Math.min(prevZoom * 1.1, 3));
	};

	const handleZoomOut = () => {
		setZoom((prevZoom) => Math.max(prevZoom / 1.1, 1));
		if (zoom <= 1) {
			setOffsetX(0);
			setOffsetY(0);
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		if (zoom > 1) {
			setIsDragging(true);
			setStartX(e.clientX - offsetX);
			setStartY(e.clientY - offsetY);
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		setOffsetX(e.clientX - startX);
		setOffsetY(e.clientY - startY);
	};

	const handleMouseUp = () => setIsDragging(false);

	const showBackground = zoom === 1;

	console.log("dialog open SecureImageView", isDialogOpen);

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(open) => {
				setIsDialogOpen(open);
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="flex flex-col"
				style={{
					backgroundColor: showBackground ? "#f8f9fa" : "transparent",
					maxWidth: showBackground ? "90vw" : "90vw",
					maxHeight: showBackground ? "90vh" : "90vh",
					width: showBackground ? "auto" : "100vw",
					height: showBackground ? "auto" : "100vh",
					boxShadow: "none",
					border: "none",
					padding: showBackground ? "1rem" : 0,
					overflow: zoom > 1 ? "hidden" : "auto",
				}}
			>
				{showBackground && (
					<DialogHeader className="w-full flex">
						<DialogTitle className="text-light-100 mt-2 py-3">
							{fileName}
						</DialogTitle>
					</DialogHeader>
				)}
				{imageUrl ? (
					<div
						onWheel={handleWheel}
						onDoubleClick={() =>
							setZoom((prevZoom) => Math.min(prevZoom + 0.5, 3))
						}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						style={{
							cursor: zoom > 1 ? "grab" : "default",
							transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
							transformOrigin: "center center",
							...(showBackground
								? { width: imageSize.width, height: imageSize.height }
								: { width: "100%", height: "100%" }),
							border: "none",
						}}
					>
						<Image
							src={imageUrl}
							alt="Preview"
							width={showBackground ? imageSize.width : 0}
							height={showBackground ? imageSize.height : 0}
							className="object-contain"
							onContextMenu={handleContextMenu}
							onDragStart={handleDragStart}
							style={{
								cursor: isDragging ? "grabbing" : "grab",
								width: "100%",
								height: "auto",
								border: "none",
							}}
						/>
					</div>
				) : (
					<p className="text-center">Loading image...</p>
				)}
				{showBackground && (
					<>
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
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default SecureImageView;

//TODO: check image zooming functionality and fix if needed
