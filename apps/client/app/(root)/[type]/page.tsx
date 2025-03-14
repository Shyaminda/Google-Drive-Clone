"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, Folder, SearchParamProps } from "@/types/types";
import { Card } from "@/components/main/card";
import { getFileTypesParams } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { Switch } from "@repo/ui/switch";
import List from "@/components/main/list";
import { Button } from "@repo/ui/button";
import { ClipLoader, PulseLoader } from "react-spinners";
import FileViewer from "@/components/ui/fileViewer";
import { useFilePreview } from "@/hooks/file-preview";
import { CreateFolder } from "@/components/main/createFolder";
import { Folders } from "@/components/main/folders";
import { useDispatch } from "react-redux";
import { openedFolder, setOpenedFolder } from "@repo/common";
import { useSelector } from "react-redux";
import { RootState } from "@repo/common/src/store/store";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string[] | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");
	const [sort, setSort] = useState<string>("date-newest");
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const { selectedViewFile, handleFileClick, closePreview } = useFilePreview();
	const [showFolders, setShowFolders] = useState<{
		show: boolean;
		folders: any;
	}>({
		show: false,
		folders: null,
	});
	const openedFolderState = useSelector((state: RootState) =>
		openedFolder(state),
	);
	console.log("Opened folder page:", openedFolderState);

	const dispatch = useDispatch();

	const searchParams = useSearchParams();
	const fileId = searchParams.get("f") || "";

	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const fetchParams = async () => {
			const params = await initialParams;
			const fileTypes = getFileTypesParams(params?.type || "");
			console.log("File types:", fileTypes);

			//setFolderType(params?.type || null);

			setType(fileTypes);
			setLimit(params?.limit || "15");

			try {
				const fetchedFiles = await fetchFiles(
					fileTypes.join(","),
					params?.limit || "15",
					sort,
					params?.searchText,
					undefined,
					openedFolderState?.id,
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
	}, [initialParams, limit, sort, openedFolderState]);

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
				openedFolderState?.id,
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

	const handleClick = (folder: Folder) => {
		dispatch(setOpenedFolder(folder));
		setShowFolders({ show: true, folders: folder });
	};

	const selectedFile = files.find((file) => file.id === fileId);

	console.log("showFolders page:", showFolders);

	return (
		<div className="page-container">
			<section className="w-full">
				<div className="flex justify-between items-center">
					<h1 className="h1 capitalize">
						{fileId && selectedFile ? (
							selectedFile.name
						) : openedFolderState ? (
							<>
								{type}{" "}
								<span className="text-base text-light-100 font-normal">
									{openedFolderState.name}
								</span>
							</>
						) : (
							type
						)}
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
								{openedFolderState && (
									<button
										onClick={() => {
											dispatch(setOpenedFolder(null));
										}}
										className="mb-4 p-2 bg-blue-500 text-white rounded"
									>
										Back
									</button>
								)}
								<CreateFolder type={type?.join(",") || ""} />
								<Folders
									setShowFolders={setShowFolders}
									showFolders={showFolders}
									inType={type?.join(",") || ""}
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

			{files.length >= 0 ? (
				<div
					className={
						showFolders.show
							? "grid grid-cols-4 gap-6 w-full items-start"
							: "flex w-full gap-6"
					}
				>
					<section
						className={
							showFolders.show
								? `col-span-3 ${isGridView ? "file-list" : "w-full"}`
								: `${isGridView ? "file-list" : "w-full"}`
						}
					>
						{openedFolderState ? (
							<div>
								{files
									.filter((file) => file.folderId === openedFolderState?.id)
									.map((file) =>
										isGridView ? (
											<Card
												key={file.id}
												showFolders={showFolders?.show}
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
										) : (
											<List
												key={file.id}
												file={[file]}
												onClick={handleFileClick}
											/>
										),
									)}
							</div>
						) : isGridView ? (
							files.map((file) => (
								<Card
									key={file.id}
									showFolders={showFolders?.show} //used for UI changes
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

					{showFolders.show && (
						<section className="dashboard-recent-files col-span-1">
							{openedFolderState && (
								<button
									onClick={() => {
										dispatch(setOpenedFolder(null));
										//setShowFolders((prev) => ({ ...prev, show: false }));
									}}
									className="mb-4 p-2 bg-blue-500 text-white rounded"
								>
									Back
								</button>
							)}
							<h2 className="h3 xl:h2 text-light-100">Folders</h2>
							<div className="flex flex-col gap-4">
								{showFolders.folders?.length > 0 ? (
									showFolders.folders.map((folder: Folder) => (
										<div
											key={folder.id}
											className="folder-item p-2 rounded-lg bg-light-800 hover:bg-light-700 transition-colors cursor-pointer"
											onClick={() => handleClick(folder)}
										>
											<p className="text-light-100 font-medium">
												{folder.name}
											</p>
										</div>
									))
								) : (
									<p className="text-light-300">No folders to display</p>
								)}
							</div>
						</section>
					)}

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
				</div>
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

//TODO: disabled the folder button until fetching the folders
//TODO: don't pass the bucket url for files
//TODO: check load more function with folderId
