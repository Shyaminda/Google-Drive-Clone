"use client";

import { useState, useEffect } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, SearchParamProps } from "@/types/types";
import { Card } from "@/components/main/card";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");
	// const type = params?.type;
	// const limit = params?.limit || "10";

	useEffect(() => {
		const fetchParams = async () => {
			const params = await initialParams;
			setType(params?.type);
			setLimit(params?.limit || "10");

			try {
				const fetchedFiles = await fetchFiles(
					params?.type,
					params?.limit || "10",
				);
				setFiles(fetchedFiles);
			} catch (error) {
				console.error("Error fetching files:", error);
			}
		};

		fetchParams();
	}, [initialParams, limit]);

	return (
		<div className="page-container">
			<section className="w-full">
				<h1 className="h1 capitalize">{type}</h1>
				<div className="total-size-section">
					<p className="body-1">
						Total: <span className="h5">0 MB</span>
					</p>
					<div className="sort-container">
						<p className="body-1 hidden sm:block text-light-200">Sort by:</p>
						<Sort />
					</div>
				</div>
			</section>
			{files.length > 0 ? (
				<section className="file-list">
					{files.map((file) => (
						<Card key={file.id} file={file} />
					))}
				</section>
			) : (
				<p className="empty-list">No files uploaded</p>
			)}
		</div>
	);
};

export default Page;

// {
// 	"Version": "2012-10-17",
// 	"Statement": [
// 		{
// 			"Sid": "Statement1",
// 			"Effect": "Allow",
// 			"Principal": "*",
// 			"Action": [
// 				"s3:GetObject",
// 				"s3:PutObject",
// 				"s3:DeleteObject"
// 			],
// 			"Resource": "arn:aws:s3:::driveway-store/*"
// 		}
// 	]
// }
