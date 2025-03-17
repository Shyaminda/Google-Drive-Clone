"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sort from "@/components/main/sort";
import { fetchFiles } from "@/hooks/fetch-files";
import { File, Folder, SearchParamProps } from "@/types/types";
import { Card } from "@/components/main/card";
import { getFileTypesParams, getFolderIcon } from "@/utils/utils";
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
import {
	goBack,
	openedFolder,
	resetFolderState,
	setOpenedFolder,
} from "@repo/common";
import { useSelector } from "react-redux";
import { RootState } from "@repo/common/src/store/store";
import { fetchFolders } from "@/hooks/fetch-folders";
import Image from "next/image";
import FolderActionDropdown from "@/components/main/actionDropdownFolder";

const Page = ({ params: initialParams }: SearchParamProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const [type, setType] = useState<string[] | undefined>(undefined);
	const [limit, setLimit] = useState<string>("10");
	const [sort, setSort] = useState<string>("date-newest");
	const [sortFolder, setSortFolder] = useState<string>("date-newest");
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

	const memoizedDispatch = useCallback(() => {
		dispatch(resetFolderState()); //added for consistency in dependency array of useEffect
	}, [dispatch]);

	useEffect(() => {
		memoizedDispatch();
		setShowFolders({ show: false, folders: null });
	}, [memoizedDispatch]);

	useEffect(() => {
		const fetchFoldersOnBack = async () => {
			if (showFolders.show) {
				try {
					const response = await fetchFolders(
						type?.join(",") || "",
						openedFolderState?.id,
						sortFolder,
					);
					console.log("Fetched folders on back:", response.folders);

					setShowFolders({
						show: true,
						folders: response.folders,
					});
				} catch (error) {
					console.error("Error fetching folders on back:", error);
				}
			} else {
				setShowFolders({ show: false, folders: null });
			}
		};

		fetchFoldersOnBack();
	}, [openedFolderState, type, showFolders.show, sortFolder]);

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

	const handleClick = async (folder: Folder) => {
		dispatch(setOpenedFolder(folder));
		setShowFolders({ show: true, folders: null });

		try {
			const response = await fetchFolders(
				type?.join(",") || "",
				folder.id,
				sortFolder,
			);
			console.log("Fetched folders (inside folder):", response.folders);

			setShowFolders({
				show: true,
				folders: response.folders,
			});
		} catch (error) {
			console.error("Error fetching folders:", error);
		}
	};

	const handleFolderHome = async () => {
		memoizedDispatch();
	};

	const selectedFile = files.find((file) => file.id === fileId);

	console.log("showFolders type:", type?.join(","));

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
							<div className="flex gap-5 items-center">
								{openedFolderState && (
									<Button
										variant="link"
										onClick={() => {
											dispatch(goBack());
										}}
										className=" p-2 bg-blue-500 text-white rounded"
									>
										<Image
											src="/assets/icons/folder-previous.svg"
											alt={`folder icon`}
											width={23}
											height={23}
											className="h-auto cursor-pointer transition-all hover:scale-110 ease-in-out duration-200"
										/>
									</Button>
								)}
								<Button
									variant="link"
									onClick={() => {
										handleFolderHome();
									}}
									className=" p-2 bg-blue-500 text-white rounded"
								>
									{showFolders.show && openedFolderState && (
										<Image
											src="/assets/icons/folder-home.png"
											alt={`folder icon`}
											width={23}
											height={23}
											className="h-auto cursor-pointer transition-all hover:scale-110 ease-in-out duration-200"
										/>
									)}
								</Button>
								<CreateFolder type={type?.join(",") || ""} />
								<Folders
									setShowFolders={setShowFolders}
									showFolders={showFolders}
									inType={type?.join(",") || ""}
									folderId={openedFolderState?.id || ""}
								/>
							</div>
							<div className="sort-container">
								<p className="body-1 hidden sm:block text-light-200 selection:font-medium">
									Sort by:
								</p>
								<Sort handleSortChange={(value) => setSort(value)} />
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
							<div className="flex items-center">
								{openedFolderState && (
									<Button
										variant="link"
										onClick={() => {
											dispatch(goBack());
										}}
										className="mb-4 p-2 bg-blue-500 text-white rounded"
									>
										<Image
											src="/assets/icons/folder-back.svg"
											alt={`folder icon`}
											width={20}
											height={20}
											className="mr-2"
										/>
									</Button>
								)}
								<div className="flex items-center justify-between w-full">
									<h2 className="h3 xl:h2 text-light-100 mb-2">Folders</h2>
									<div className="sort-container">
										<Sort
											handleSortChange={(value) => setSortFolder(value)}
											isFolderSort={true}
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-4">
								{showFolders.folders?.length > 0 ? (
									showFolders.folders.map((folder: Folder) => (
										<div
											key={folder.id}
											className="rounded-lg bg-light-800 hover:bg-light-700 transition-colors cursor-pointer"
											onClick={() => handleClick(folder)}
										>
											<div className="flex items-center justify-between gap-3 hover:bg-slate-100 py-1 rounded-2xl hover:ease-in-out hover:scale-105 transition-transform duration-200 cursor-pointer">
												<Image
													src={getFolderIcon(type?.join(",") || "")}
													alt={`${type} folder icon`}
													width={35}
													height={35}
													className="ml-2"
												/>
												<p className="text-light-100 font-medium">
													{folder.name}
												</p>
												<div className="flex items-center justify-end w-full mr-2">
													<FolderActionDropdown folder={folder} />
												</div>
											</div>
										</div>
									))
								) : (
									<p className="text-light-100">No folders to display</p>
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
//TODO: mobile view for folders UI
