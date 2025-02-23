import { CardProps } from "@/types/types";
import Thumbnail from "@/components/ui/Thumbnail";
import { convertFileSize } from "@/utils/utils";
import FormattedDateTime from "@/components/main/formattedDateTime";
import ActionDropdown from "@/components/main/actionDropdown";

export const Card = ({ file, onClick }: CardProps) => {
	return (
		<div
			className="file-card hover:ease-in-out hover:scale-105 transition-transform duration-250"
			onClick={onClick}
		>
			<div className="flex justify-between">
				<Thumbnail
					id={file.id}
					type={file.type}
					extension={file.extension}
					thumbnailUrl={file.thumbnailUrl}
					bucketField={file.type === "IMAGE" ? file.bucketField : ""}
					className="!size-20"
					imageClassName="!size-11"
				/>
				<div className="flex flex-col items-end justify-between">
					<ActionDropdown file={file} />
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
		</div>
	);
};

//TODO: add breadcrumbs
