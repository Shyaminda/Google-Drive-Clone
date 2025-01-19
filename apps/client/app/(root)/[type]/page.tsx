"use client";

import { useState, useEffect } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, SearchParamProps } from "@/types/types";

const Page = ({ params }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const type = params?.type;
	const limit = params?.limit || "10";

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedFiles = await fetchFiles(type, limit);
				setFiles(fetchedFiles);
			} catch (error) {
				console.error("Error fetching files:", error);
			}
		};

		fetchData();
	}, [type, limit]);

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
				<section className="files-list">
					{files.map((file) => (
						<h1 className="h1" key={file.id}>
							{file.name}
						</h1>
					))}
				</section>
			) : (
				<p className="empty-list">No files uploaded</p>
			)}
		</div>
	);
};

export default Page;
