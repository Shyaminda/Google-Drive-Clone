import { useEffect, useRef } from "react";

const SecureImageView = ({ url }: { url: string }) => {
	console.log("Secure Image View URL reached", url);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const img = new Image();
		img.src = url;
		img.crossOrigin = "Anonymous"; // Prevents CORS issues when drawing to canvas

		img.onload = () => {
			const canvas = canvasRef.current!;
			const ctx = canvas.getContext("2d")!;
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
		};

		return () => URL.revokeObjectURL(url);
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

	return (
		<div style={{ position: "relative", display: "inline-block" }}>
			<canvas
				ref={canvasRef}
				onContextMenu={handleContextMenu}
				onDragStart={handleDragStart}
			/>

			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "transparent",
					zIndex: 10,
				}}
				onContextMenu={handleContextMenu}
				onDragStart={handleDragStart}
			/>
		</div>
	);
};

export default SecureImageView;
