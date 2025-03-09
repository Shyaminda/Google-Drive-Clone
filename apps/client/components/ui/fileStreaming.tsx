import { bucketObjectAccessStreaming } from "@/hooks/bucket-file-action-streaming";
import { useEffect, useRef } from "react";

const FileViewer = ({
	bucketField,
	fileType,
	id,
	fileName,
	onClose,
}: {
	bucketField: string;
	fileType: string;
	id: string;
	fileName: string;
	onClose: () => void;
}) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const mediaSourceRef = useRef<MediaSource | null>(null);
	const sourceBufferRef = useRef<SourceBuffer | null>(null);
	const isMountedRef = useRef(true);
	const { objectAccess } = bucketObjectAccessStreaming();

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (fileType !== "VIDEO") return;

		let mediaSource: MediaSource;
		let objectUrl: string;

		const cleanup = () => {
			if (mediaSourceRef.current) {
				if (mediaSourceRef.current.readyState === "open") {
					try {
						mediaSourceRef.current.endOfStream();
					} catch (e) {
						console.error("MediaSource cleanup error:", e);
					}
				}
				URL.revokeObjectURL(objectUrl);
				mediaSourceRef.current = null;
			}
			sourceBufferRef.current = null;
		};

		const initializeMediaSource = () => {
			cleanup();

			mediaSource = new MediaSource();
			mediaSourceRef.current = mediaSource;
			objectUrl = URL.createObjectURL(mediaSource);

			if (videoRef.current) {
				videoRef.current.src = objectUrl;
				videoRef.current
					.play()
					.catch((e) => console.error("Video play error:", e));
			}

			mediaSource.addEventListener("sourceopen", handleSourceOpen);
			return () => {
				mediaSource.removeEventListener("sourceopen", handleSourceOpen);
				cleanup();
			};
		};

		const handleSourceOpen = async () => {
			if (!isMountedRef.current) return;

			try {
				const mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
				if (!MediaSource.isTypeSupported(mimeType)) {
					throw new Error("Unsupported MIME type");
				}

				const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
				sourceBufferRef.current = sourceBuffer;
				sourceBuffer.mode = "sequence";

				setupSourceBufferListeners(sourceBuffer);
				startStreaming();
			} catch (error) {
				console.error("MediaSource setup error:", error);
				cleanup();
			}
		};

		const setupSourceBufferListeners = (sourceBuffer: SourceBuffer) => {
			const errorHandler = () =>
				console.error("SourceBuffer error:", sourceBuffer.onerror);

			const updateEndHandler = () => {
				if (!isMountedRef.current || !sourceBufferRef.current) return;
				processQueue();
			};

			sourceBuffer.addEventListener("error", errorHandler);
			sourceBuffer.addEventListener("updateend", updateEndHandler);

			return () => {
				sourceBuffer.removeEventListener("error", errorHandler);
				sourceBuffer.removeEventListener("updateend", updateEndHandler);
			};
		};

		const queue: Uint8Array[] = [];
		let isFetching = false;
		let startByte = 0;
		const CHUNK_SIZE = 1024 * 1024;

		const processQueue = () => {
			if (
				!sourceBufferRef.current ||
				sourceBufferRef.current.updating ||
				queue.length === 0 ||
				!mediaSourceRef.current ||
				mediaSourceRef.current.readyState !== "open"
			)
				return;

			const chunk = queue.shift();
			if (!chunk) return;

			try {
				sourceBufferRef.current.appendBuffer(chunk);
			} catch (error) {
				console.error("Chunk append error:", error);
			}
		};

		const startStreaming = async () => {
			if (isFetching || !isMountedRef.current) return;
			isFetching = true;

			try {
				while (isMountedRef.current) {
					const { success, stream } = await objectAccess(
						bucketField,
						false,
						"VIEW",
						id,
						startByte,
						startByte + CHUNK_SIZE - 1,
					);

					if (!success || !stream) {
						if (mediaSourceRef.current?.readyState === "open") {
							mediaSourceRef.current.endOfStream();
						}
						break;
					}

					const reader = stream.getReader();
					while (isMountedRef.current) {
						const { done, value } = await reader.read();
						if (done) break;

						if (value) {
							queue.push(value);
							startByte += value.byteLength;
							processQueue();
						}
					}
				}
			} catch (error) {
				console.error("Streaming error:", error);
				cleanup();
			} finally {
				isFetching = false;
			}
		};

		const cleanupFn = initializeMediaSource();
		return () => {
			cleanupFn?.();
			cleanup();
		};
	}, [bucketField, fileType, id, objectAccess]);

	return (
		<div className="file-viewer">
			<h3>{fileName}</h3>
			<video
				ref={videoRef}
				controls
				style={{ maxWidth: "100%" }}
				onError={(e) =>
					console.error("Video element error:", e.currentTarget.error)
				}
			/>
			<button onClick={onClose}>Close</button>
		</div>
	);
};

export default FileViewer;
