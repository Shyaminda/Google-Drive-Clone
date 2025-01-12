"use client";

import { convertFileToUrl, getFileType } from "@/utils/utils";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Thumbnail from "@/components/ui/Thumbnail";

interface FileUploaderProps {
	ownerId: string;
	accountId: string;
	className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setFiles(acceptedFiles);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleRemoveFile = (
		e: React.MouseEvent<HTMLImageElement>,
		fileName: string,
	) => {
		e.stopPropagation();
		setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
	};

	return (
		<div {...getRootProps()} className="cursor-pointer">
			<input {...getInputProps()} />
			<Button type="button" className={cn("uploader-button", className)}>
				<Image
					src="/assets/icons/upload.svg"
					alt="upload"
					width={24}
					height={24}
				/>
				<p>upload</p>
			</Button>
			{files.length > 0 && (
				<ul className="uploader-preview-list">
					<h4 className="h4 text-light-100">uploading</h4>
					{files.map((file, index) => {
						const { type, extension } = getFileType(file.name);
						return (
							<li
								key={`${file.name}-${index}`}
								className="uploader-preview-item"
							>
								<div className="flex items-center gap-3">
									<Thumbnail
										type={type}
										extension={extension}
										url={convertFileToUrl(file)}
									/>
									<div className="preview-file-name">
										{file.name}
										<Image
											src="/assets/icons/file-loader.gif"
											alt="loader"
											width={80}
											height={26}
										/>
										{/* //Todo - add percentage function to upload */}
									</div>
								</div>
								<Image
									src="/assets/icons/remove.svg"
									alt="remove"
									width={24}
									height={24}
									onClick={(e) => handleRemoveFile(e, file.name)}
								/>
							</li>
						);
					})}
				</ul>
			)}
			{isDragActive ? (
				<p>Drop the files here ...</p>
			) : (
				<p>Drag drop some files here, or click to select files</p>
			)}
		</div>
	);
};

export default FileUploader;
