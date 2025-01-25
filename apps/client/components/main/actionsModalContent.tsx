import { DetailsProps, ShareFileProps } from "@/types/types";
import React from "react";
import Thumbnail from "@/components/ui/Thumbnail";
import FormattedDateTime from "./formattedDateTime";
import { convertFileSize, formatDateTime } from "@/utils/utils";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import Image from "next/image";

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

export const ShareFile = ({
	file,
	onInputChange,
	onRemove,
}: ShareFileProps) => {
	return (
		<div>
			<ImageThumbnail file={file} />
			<div className="share-wrapper">
				<p className="subtitle-2 pl-1 text-light-100">
					Share file with other users
				</p>
				<Input
					type="email"
					placeholder="Enter Email address"
					onChange={(e) => onInputChange(e.target.value.trim().split(","))} //multiple emails
					className="share-input-field"
				/>
				<div className="pt-4">
					<div className="flex justify-between">
						<p className="subtitle-2 text-light-100">Shared with:</p>
						<p className="subtitle-2 text-light-200">
							{file.user.length} users
						</p>
					</div>
					<ul className="pt-2">
						{file.user.map((email) => (
							<li
								key={email}
								className="flex items-center justify-between gap-2"
							>
								<p className="subtitle-2">{email}</p>
								<Button onClick={() => onRemove(email)} variant="ghost">
									<Image
										src="/assets/icons/remove.svg"
										alt="remove"
										width={24}
										height={24}
										className="remove-icon"
									/>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
