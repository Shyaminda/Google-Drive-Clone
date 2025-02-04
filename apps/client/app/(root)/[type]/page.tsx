"use client";

import { useState, useEffect } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, SearchParamProps } from "@/types/types";
import { Card } from "@/components/main/card";
import { getFileTypesParams } from "@/utils/utils";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string[] | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");

	useEffect(() => {
		const fetchParams = async () => {
			const params = await initialParams;
			const fileTypes = getFileTypesParams(params?.type || "");

			setType(fileTypes);
			setLimit(params?.limit || "20");

			try {
				const fetchedFiles = await fetchFiles(
					fileTypes.join(","),
					params?.limit || "20",
					params?.searchText,
					params?.sort,
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
