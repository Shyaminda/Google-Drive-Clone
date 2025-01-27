import { bucketObjectAccess } from "@/hooks/bucket-file-action";
import { ThumbnailProps } from "@/types/types";
import { getFileIcon } from "@/utils/utils";
import { cn } from "@repo/ui/lib";
import Image from "next/image";
import { useState, useEffect } from "react";

const Thumbnail = ({
	type,
	extension,
	bucketField,
	imageClassName,
	className,
}: ThumbnailProps) => {
	const { objectAccess } = bucketObjectAccess();
	const [imageUrl, setImageUrl] = useState("");
	const [isBrokenImage, setIsBrokenImage] = useState(false);

	useEffect(() => {
		const fetchThumbnail = async () => {
			if (!imageUrl && bucketField) {
				const { success, url } = await objectAccess(bucketField, false, {
					triggeredBy: "fetchThumbnail",
				});
				if (success) {
					console.log("Fetched thumbnail URL", url);
					setImageUrl(url);
				} else {
					setIsBrokenImage(true);
				}
			}
		};
		fetchThumbnail();
	}, [bucketField, objectAccess, type, imageUrl]);

	const isImage = type === "IMAGE" && extension !== "svg";

	const thumbnail =
		isImage && !isBrokenImage
			? imageUrl || getFileIcon(extension, type)
			: getFileIcon(extension, type);

	return (
		<figure className={cn("thumbnail", className)}>
			<Image
				src={thumbnail}
				alt="thumbnail"
				width={100}
				height={100}
				unoptimized // Disable Next.js optimization
				className={cn(
					"size-8 object-contain",
					imageClassName,
					isImage && "thumbnail-image",
				)}
				onError={() => {
					if (isImage) {
						setIsBrokenImage(true);
					}
				}}
			/>
		</figure>
	);
};

export default Thumbnail;
