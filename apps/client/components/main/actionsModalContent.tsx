import { DetailsProps } from "@/types/types";
import React from "react";
import Thumbnail from "@/components/ui/Thumbnail";
import FormattedDateTime from "./formattedDateTime";
import { convertFileSize, formatDateTime } from "@/utils/utils";

const ImageThumbnail = ({ file }: DetailsProps) => {
	return (
		<div className="file-details-thumbnail">
			<Thumbnail
				type={file.type}
				extension={file.extension}
				bucketField={file.bucketField}
			/>
			<div className="flex flex-col">
				<p className="subtitle-2 mb-1">{file.name}</p>
				<FormattedDateTime
					date={new Date(file.createdAt).toISOString()}
					className="caption"
				/>
			</div>
		</div>
	);
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
	return (
		<div className="flex">
			<p className="file-details-label text-left">{label}</p>
			<p className="file-details-value text-left">{value}</p>
		</div>
	);
};

export const FileDetails = ({ file }: DetailsProps) => {
	return (
		<>
			<ImageThumbnail file={file} />
			<div className="space-y-4 px-2 pt-2">
				<DetailRow label="Format:" value={file.extension} />
				<DetailRow label="Size:" value={convertFileSize(file.size)} />
				<DetailRow label="Owner:" value={file.owner.name} />
				<DetailRow
					label="Last Edited:"
					value={formatDateTime(new Date(file.updatedAt).toISOString())}
				/>
			</div>
		</>
	);
};
