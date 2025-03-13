"use client";

import Header from "@/components/main/header";
import MobileNavigation from "@/components/main/mobileNavigation";
import Sidebar from "@/components/main/sidebar";
import { useFetchUser } from "@/hooks/fetch-user";
import { Toaster } from "@repo/ui/toaster";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { user } = useFetchUser();
	return (
		<main className="flex h-screen">
			<Sidebar />
			<section className="flex h-full flex-1 flex-col">
				<MobileNavigation {...user} name={user?.name || ""} />
				<Header userId={user?.id || ""} />
				<div className="main-content">{children}</div>
			</section>
			<Toaster />
		</main>
	);
};

export default Layout;

{
	/* {files.length > 0 ? (
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
						{fileId ? (
							files
								.filter((file) => file.id === fileId)
								.map((file) =>
									isGridView ? (
										<Card
											showFolders={showFolders?.show}
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
							))
						) : (
							<div ref={lastFileCallback}>
								<List file={files} onClick={handleFileClick} />
							</div>
						)}
					</section>

					{showFolders.show && (
						<section className="dashboard-recent-files col-span-1">
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
			)} */
}
