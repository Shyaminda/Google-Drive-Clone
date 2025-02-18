import { fileExtensions, getAudioMimeType } from "@/utils/utils";
import { useEffect } from "react";

const SecureAudioView = ({ url }: { url: string }) => {
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
		<audio
			controls
			controlsList="nodownload"
			style={{ maxWidth: "100%" }}
			onContextMenu={handleContextMenu}
			onDragStart={handleDragStart}
		>
			{fileExtensions.audio.map((ext) => (
				<source key={ext} src={url} type={getAudioMimeType(ext)} />
			))}
		</audio>
	);
};

export default SecureAudioView;
