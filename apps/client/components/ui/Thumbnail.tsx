import { ThumbnailProps } from "@/types/types";
import { getFileIcon } from "@/utils/utils";
import { cn } from "@repo/ui/lib";
import Image from "next/image";

const Thumbnail = ({
	type,
	extension,
	thumbnailUrl,
	imageClassName,
	className,
}: ThumbnailProps) => {
	const isImage = type === "IMAGE" && extension !== "svg";

	//console.log("Thumbnail URL", thumbnailUrl);

	const thumbnail =
		type === "IMAGE" ? thumbnailUrl : getFileIcon(extension, type);

	return (
		<figure className={cn("thumbnail", className)}>
			<Image
				src={thumbnail || getFileIcon(extension, type)}
				alt="thumbnail"
				width={100}
				height={100}
				loading="lazy"
				unoptimized // Disable Nextjs optimization
				className={cn(
					"object-contain size-8",
					imageClassName,
					isImage && "thumbnail-image",
				)}
			/>
		</figure>
	);
};

export default Thumbnail;
