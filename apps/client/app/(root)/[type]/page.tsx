"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, SearchParamProps } from "@/types/types";
import { Card } from "@/components/main/card";
import { getFileTypesParams } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { Switch } from "@repo/ui/switch";
import List from "@/components/main/list";
import { Button } from "@repo/ui/button";
import { ClipLoader, PulseLoader } from "react-spinners";
import FileViewer from "@/components/ui/fileViewer";
import { useFilePreview } from "@/hooks/file-preview";
import Image from "next/image";
import { CreateFolder } from "@/components/main/createFolder";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string[] | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");
	const [sort, setSort] = useState<string>("date-newest");
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const { selectedViewFile, handleFileClick, closePreview } = useFilePreview();

	const searchParams = useSearchParams();
	const fileId = searchParams.get("f") || "";

	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const fetchParams = async () => {
			const params = await initialParams;
			const fileTypes = getFileTypesParams(params?.type || "");

			setType(fileTypes);
			setLimit(params?.limit || "15");

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
				"15",
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

	const lastFileCallback = useCallback(
		(node: HTMLDivElement | null) => {
			if (loadingMore || !nextCursor || isGridView) return;

			if (observerRef.current) observerRef.current.disconnect();

			observerRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						handleLoadMore();
					}
				},
				{ threshold: 1.0 },
			);

			if (node) observerRef.current.observe(node);
		},
		[loadingMore, nextCursor, isGridView],
	);

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
						<div className="flex justify-between items-center gap-5">
							<div className="flex gap-5">
								<CreateFolder />

								<Image
									src="/assets/icons/folder.svg"
									alt="folder"
									width={23}
									height={23}
									className="h-auto cursor-pointer transition-all hover:scale-110 ease-in-out duration-200"
								/>
							</div>
							<div className="sort-container">
								<p className="body-1 hidden sm:block text-light-200 selection:font-medium">
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
						{fileId ? (
							files
								.filter((file) => file.id === fileId)
								.map((file) =>
									isGridView ? (
										<Card
											key={file.id}
											file={file}
											onClick={
												() =>
													handleFileClick(
														file.id,
														file.bucketField,
														file.type,
														file.name,
													) // here onClick={handleFileClick} not used directly because from card itself we pass the data unlike in list
											}
										/>
									) : (
										<List
											key={file.id}
											file={files}
											onClick={handleFileClick}
										/>
									),
								)
						) : isGridView ? (
							files.map((file) => (
								<Card
									key={file.id}
									file={file}
									onClick={() =>
										handleFileClick(
											file.id,
											file.bucketField,
											file.type,
											file.name,
										)
									}
								/>
							))
						) : (
							<div ref={lastFileCallback}>
								<List file={files} onClick={handleFileClick} />
							</div>
						)}
					</section>
					{loadingMore && !isGridView && <ClipLoader color="#997dff" />}
					{loadingMore && isGridView ? (
						<PulseLoader size={15} color="#997dff" />
					) : nextCursor && !fileId && isGridView ? (
						<div className="flex justify-center mt-8">
							<Button
								variant="load"
								onClick={handleLoadMore}
								disabled={loadingMore}
							>
								{"Load More"}
							</Button>
						</div>
					) : null}
				</>
			) : (
				<p className="empty-list">No files uploaded</p>
			)}

			{selectedViewFile && (
				<FileViewer
					bucketField={selectedViewFile?.bucketField}
					fileType={selectedViewFile?.type}
					id={selectedViewFile?.id}
					fileName={selectedViewFile?.name}
					onClose={closePreview}
				/>
			)}
		</div>
	);
};

export default Page;
