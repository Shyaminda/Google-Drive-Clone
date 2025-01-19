import { CardProps } from "@/types/types";
import Link from "next/link";
import Thumbnail from "@/components/ui/Thumbnail";
import { convertFileSize } from "@/utils/utils";
import FormattedDateTime from "@/components/main/formattedDateTime";

export const Card = ({ file }: CardProps) => {
	return (
		<Link href={file.url} target="_blank" className="file-card">
			<div className="flex justify-between">
				<Thumbnail
					type={file.type}
					extension={file.extension}
					url={file.url}
					className="!size-20"
					imageClassName="!size-11"
				/>
				<div className="flex flex-col items-end justify-between">
					Actions
					<p className="body-1">{convertFileSize(file.size)}</p>
				</div>
			</div>
			<div className="file-card-details">
				<p className="subtitle-2 line-clamp-1">{file.name}</p>
				<FormattedDateTime
					date={new Date(file.createdAt).toISOString()}
					className="body-2 text-light-100"
				/>
				<p className="caption line-clamp-1 text-light-200">
					By: {file.owner?.name || "Unknown"}
				</p>
			</div>
		</Link>
	);
};
