import { DetailsProps, ShareFileProps } from "@/types/types";
import Thumbnail from "@/components/ui/Thumbnail";
import FormattedDateTime from "./formattedDateTime";
import { convertFileSize, formatDateTime } from "@/utils/utils";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchFilePermissions } from "@/hooks/fetch-file-permissions";

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
	onPermissionChange,
}: ShareFileProps) => {
	const [permissions, setPermissions] = useState<string[]>([]); //permissions that the user have for the file fetched from the server
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
	const [sharedUsers, setSharedUsers] = useState<string[]>([]);

	const permissionList = [
		{ id: "DOWNLOAD", label: "Download" },
		{ id: "SHARE", label: "Share" },
		{ id: "RENAME", label: "rename" },
	];

	useEffect(() => {
		const fetchPermissions = async () => {
			await fetchFilePermissions(file.id, setPermissions, setSharedUsers);
		};

		fetchPermissions();
	}, [file.id]);
	const handlePermissionChange = (permissionId: string, checked: boolean) => {
		const updatedPermissions = checked
			? [...selectedPermissions, permissionId]
			: selectedPermissions.filter((id) => id !== permissionId);

		setSelectedPermissions(updatedPermissions);

		onPermissionChange(updatedPermissions);
	};

	const filteredPermissionList = permissionList.filter(
		(perm) => Array.isArray(permissions) && permissions.includes(perm.id),
	);

	return (
		<div>
			{filteredPermissionList.length > 0 && <ImageThumbnail file={file} />}
			<div className="share-wrapper">
				{filteredPermissionList.length > 0 && (
					<>
						<p className="subtitle-2 pl-1 text-light-100">
							Share file with other users
						</p>
						<Input
							type="email"
							placeholder="Enter Email address"
							onChange={(e) => onInputChange(e.target.value.trim().split(","))} // multiple emails
							className="share-input-field"
						/>
						<div className="mt-4">
							<p className="subtitle-2 text-light-100 mb-2">
								Select Permissions:
							</p>
							<div>
								{filteredPermissionList.map((perm) => (
									<div key={perm.id} className="flex items-center gap-2 mb-2">
										<Checkbox
											id={perm.id}
											onCheckedChange={(checked) =>
												handlePermissionChange(perm.id, !!checked)
											}
										/>
										<label htmlFor={perm.id} className="text-sm text-light-100">
											{perm.label}
										</label>
									</div>
								))}
							</div>
						</div>
					</>
				)}
				<div className="pt-4">
					{sharedUsers.length > 0 ? (
						<div className="flex justify-between">
							<p className="subtitle-2 text-light-100">Shared with:</p>
							<p className="subtitle-2 text-light-200">
								{sharedUsers.length ?? 0} users
							</p>
						</div>
					) : (
						<p className="subtitle-2 text-light-200">
							You don&apos;t have permission to share this file
						</p>
					)}
					<ul className="pt-2">
						{sharedUsers.map((email) => (
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
