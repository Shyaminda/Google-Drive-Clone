import { ThumbnailProps } from "@/types/types";
import { getFileIcon } from "@/utils/utils";
import { cn } from "@repo/ui/lib";
import Image from "next/image";

const Thumbnail = ({
	type,
	extension,
	url,
	imageClassName,
	className,
}: ThumbnailProps) => {
	const isImage = type === "IMAGE" && extension !== "svg";
	return (
		<figure className={cn("thumbnail", className)}>
			<Image
				src={isImage ? url : getFileIcon(extension, type)}
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
