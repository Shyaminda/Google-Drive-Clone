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

	useEffect(() => {
		const fetchThumbnail = async () => {
			if (!imageUrl && bucketField) {
				const { success, url } = await objectAccess(bucketField, false, {
					triggeredBy: "fetchThumbnail",
				});
				if (success) {
					console.log("Fetched thumbnail URL:", url);
					setImageUrl(url);
				}
			}
		};
		fetchThumbnail();
	}, [bucketField, objectAccess, type, imageUrl]);

	const isImage = type === "IMAGE" && extension !== "svg";

	return (
		<figure className={cn("thumbnail", className)}>
			<Image
				src={
					isImage
						? imageUrl || getFileIcon(extension, type)
						: getFileIcon(extension, type)
				}
				alt="thumbnail"
				width={100}
				height={100}
				className={cn(
					"size-8 object-contain",
					imageClassName,
					isImage && "thumbnail-image",
				)}
			/>
		</figure>
	);
};

export default Thumbnail;
