/* eslint-disable indent */
"use client";

import { useState, useEffect } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, SearchParamProps } from "@/types/types";
import { Card } from "@/components/main/card";
import { getFileTypesParams } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { Switch } from "@repo/ui/switch";
import List from "@/components/main/list";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string[] | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");
	const [sort, setSort] = useState<string>("date-newest");
	const [isGridView, setIsGridView] = useState<boolean>(true);

	const searchParams = useSearchParams();
	const fileId = searchParams.get("f") || "";

	useEffect(() => {
		const fetchParams = async () => {
			const params = await initialParams;
			const fileTypes = getFileTypesParams(params?.type || "");

			setType(fileTypes);
			setLimit(params?.limit || "20");

			try {
				const fetchedFiles = await fetchFiles(
					fileTypes.join(","),
					params?.limit || "10",
					sort,
					params?.searchText,
				);
				console.log("Fetched files page:", fetchedFiles);
				if (fetchedFiles && Array.isArray(fetchedFiles.files)) {
					setFiles(fetchedFiles.files);
				} else {
					console.error("Invalid response format:", fetchedFiles);
					setFiles([]);
				}
			} catch (error) {
				console.error("Error fetching files:", error);
			}
		};

		fetchParams();
	}, [initialParams, limit, sort]);

	const selectedFile = files.find((file) => file.id === fileId);

	return (
		<div className="page-container">
			<section className="w-full">
				<h1 className="h1 capitalize">
					{fileId && selectedFile ? selectedFile.name : type}
				</h1>
				{!fileId && (
					<div className="total-size-section">
						<p className="body-1">
							Total: <span className="h5">0 MB</span>
						</p>
						<div className="">
							<Switch checked={isGridView} onCheckedChange={setIsGridView} />
						</div>
						<div className="sort-container">
							<p className="body-1 hidden sm:block text-light-200">Sort by:</p>
							<Sort setSort={setSort} />
						</div>
					</div>
				)}
			</section>
			{files.length > 0 ? (
				<section className={isGridView ? "file-list" : "w-full"}>
					{fileId
						? files
								.filter((file) => file.id === fileId)
								.map((file) =>
									isGridView ? (
										<Card key={file.id} file={file} />
									) : (
										<List key={file.id} file={[file]} />
									),
								)
						: isGridView
							? files.map((file) => <Card key={file.id} file={file} />)
							: files.length > 0 && <List file={files} />}
				</section>
			) : (
				<p className="empty-list">No files uploaded</p>
			)}
		</div>
	);
};

export default Page;
