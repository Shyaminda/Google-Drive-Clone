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
import { Button } from "@repo/ui/button";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string[] | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");
	const [sort, setSort] = useState<string>("date-newest");
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);

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
					params?.limit || "15",
					sort,
					params?.searchText,
				);
				console.log("Fetched files page:", fetchedFiles);
				if (fetchedFiles && Array.isArray(fetchedFiles.files)) {
					setFiles(fetchedFiles.files);
					setNextCursor(fetchedFiles.nextCursor || null);
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

	const handleLoadMore = async () => {
		if (!nextCursor) return;

		setLoadingMore(true);
		try {
			const fetchedMoreFiles = await fetchFiles(
				type?.join(",") || "",
				"10",
				sort,
				searchParams.get("searchText") || "",
				nextCursor,
			);

			if (fetchedMoreFiles?.files) {
				const newFiles = fetchedMoreFiles.files.filter(
					(file: { id: string }) =>
						!files.some((existingFile) => existingFile.id === file.id),
				);
				setFiles((prev) => [...prev, ...newFiles]);
				setNextCursor(fetchedMoreFiles.nextCursor || null);
			}
		} catch (error) {
			console.error("Error loading more files:", error);
		} finally {
			setLoadingMore(false);
		}
	};

	const selectedFile = files.find((file) => file.id === fileId);

	return (
		<div className="page-container">
			<section className="w-full">
				<div className="flex justify-between items-center">
					<h1 className="h1 capitalize">
						{fileId && selectedFile ? selectedFile.name : type}
					</h1>
					<div className="mb-2 mr-2">
						<Switch checked={isGridView} onCheckedChange={setIsGridView} />
					</div>
				</div>
				{!fileId && (
					<div className="total-size-section">
						<p className="body-1">
							Total: <span className="h5">0 MB</span>
						</p>
						<div className="">
							<div className="sort-container">
								<p className="body-1 hidden sm:block text-light-200">
									Sort by:
								</p>
								<Sort setSort={setSort} />
							</div>
						</div>
					</div>
				)}
			</section>
			{files.length > 0 ? (
				<>
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
					{nextCursor && !fileId && (
						<div className="flex justify-center mt-8">
							<Button
								variant="load"
								onClick={handleLoadMore}
								disabled={loadingMore}
							>
								{loadingMore ? "Loading..." : "Load More"}
							</Button>
						</div>
					)}
				</>
			) : (
				<p className="empty-list">No files uploaded</p>
			)}
		</div>
	);
};

export default Page;
