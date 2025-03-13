"use client";

import { getFileType } from "@/utils/utils";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Thumbnail from "@/components/ui/Thumbnail";
import { useToast } from "@repo/ui/toasterHook";
import axios, { AxiosProgressEvent } from "axios";
import { Progress } from "@repo/ui/progress";
import { FileUploaderProps } from "@/types/types";

const FileUploader = ({ ownerId, className, folderId }: FileUploaderProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [uploadProgress, setUploadProgress] = useState<{
		[key: string]: number;
	}>({});
	const { toast } = useToast();
	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setFiles(acceptedFiles);

			const formData = new FormData();
			acceptedFiles.forEach((file) => formData.append("file", file));

			if (folderId) {
				formData.append("folderId", folderId);
			}
			try {
				const response = await axios.post(
					"http://localhost:3001/api/v1/files/upload",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
						withCredentials: true,
						onUploadProgress: (progressEvent: AxiosProgressEvent) => {
							if (progressEvent.total) {
								const percent = Math.round(
									(progressEvent.loaded * 100) / progressEvent.total,
								);
								if (percent < 100) {
									setUploadProgress((prev) => ({
										...prev,
										[acceptedFiles[0].name]: percent,
									}));
								}
							}
						},
					},
				);

				if (response.data?.upload?.success) {
					toast({
						description: (
							<p className="body-2">
								<span className="font-semibold text-green">Success:</span> Files
								uploaded successfully!
							</p>
						),
						className: "success-toast",
						variant: "default",
					});
					setFiles([]);
				} else {
					toast({
						description: (
							<p className="body-2 text-white">
								<span className="font-semibold">Error:</span>
								{response.data.error}
							</p>
						),
						className: "error-toast",
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("File upload error:", error);
				toast({
					description: (
						<p className="body-2 text-white">
							<span className="font-semibold">Error:</span> Internal server
							error
						</p>
					),
					className: "error-toast",
					variant: "destructive",
				});
			}
		},
		[ownerId, toast],
	);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const handleRemoveFile = (
		e: React.MouseEvent<HTMLImageElement>,
		fileName: string,
	) => {
		e.stopPropagation();
		setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
		setUploadProgress((prev) => {
			const newProgress = { ...prev };
			delete newProgress[fileName];
			return newProgress;
		});
	};

	return (
		<div {...getRootProps()} className="cursor-pointer">
			<input {...getInputProps()} />
			<Button
				type="button"
				className={cn(
					"uploader-button hover:ease-linear hover:scale-105 hover:font-medium transition-transform",
					className,
				)}
			>
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
						const progress = uploadProgress[file.name] || 0;
						return (
							<li
								key={`${file.name}-${index}`}
								className="uploader-preview-item"
							>
								<div className="flex items-center gap-3">
									<Thumbnail
										type={type}
										extension={extension}
										//bucketField={file.bucketField}
									/>
									<div className="preview-file-name">
										{file.name}
										<Progress value={progress} max={100} className="mt-2" />
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
		</div>
	);
};

export default FileUploader;
