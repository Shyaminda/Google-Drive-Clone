"use client";

import ActionDropdown from "@/components/main/actionDropdown";
import FormattedDateTime from "@/components/main/formattedDateTime";
import { Chart } from "@/components/ui/chart";
import FileViewer from "@/components/ui/fileViewer";
import Thumbnail from "@/components/ui/Thumbnail";
import { dashboardData } from "@/hooks/fetch-dashboard";
import { useFilePreview } from "@/hooks/file-preview";
import { DashboardDataProps, File } from "@/types/types";
import { convertFileSize, getUsageSummary } from "@/utils/utils";
import { Separator } from "@repo/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
	const { selectedViewFile, handleFileClick, closePreview } = useFilePreview();
	const [data, setData] = useState<DashboardDataProps | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await dashboardData();
				console.log("storage", response);
				setData(response);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <p>Loading...</p>;
	if (!data) return <p>No data available</p>;

	const usedStorage = parseFloat(data.usedStorage);
	const maxStorage = parseFloat(data.maxStorage);

	const usageSummary = getUsageSummary(data.summary);
	console.log("usageSummary", usageSummary);

	const groupedFiles = data.recentFiles.reduce(
		(type, file) => {
			if (!type[file.type]) {
				type[file.type] = [];
			}
			type[file.type].push(file);
			return type;
		},
		{} as Record<string, File[]>,
	);

	return (
		<div className="dashboard-container">
			<section>
				<Chart used={usedStorage} max={maxStorage} />

				<ul className="dashboard-summary-list">
					{usageSummary.map((summary) => (
						<Link
							href={summary.url}
							key={summary.title}
							className="dashboard-summary-card"
						>
							<div className="space-y-4">
								<div className="flex justify-between gap-3">
									<Image
										src={summary.icon}
										width={100}
										height={100}
										alt="uploaded image"
										className="summary-type-icon"
									/>
									<h4 className="summary-type-size">
										{convertFileSize(summary.size) || 0}
									</h4>
								</div>

								<h5 className="summary-type-title">{summary.title}</h5>
								<Separator className="bg-light-400" />
								<FormattedDateTime
									date={summary.latestDate}
									className="text-center"
								/>
							</div>
						</Link>
					))}
				</ul>
			</section>

			<section className="dashboard-recent-files">
				<h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
				{Object.keys(groupedFiles).length > 0 ? (
					<div className="mt-5 flex flex-col gap-5">
						{Object.entries(groupedFiles).map(([type, files]) => (
							<div key={type}>
								<h3 className="text-slate-500 font-semibold mb-3 py-1.5">
									{type}
								</h3>
								<ul className="flex flex-col gap-1">
									{files.map((file: File) => (
										<div
											onClick={() =>
												handleFileClick(
													file.id,
													file.bucketField,
													file.type,
													file.name,
												)
											}
											className="flex items-center gap-3 hover:bg-slate-100 p-2 rounded-2xl hover:ease-in-out hover:scale-105 transition-transform duration-200 cursor-pointer"
											key={file.id}
										>
											<Thumbnail type={file.type} extension={file.extension} />

											<div className="recent-file-details">
												<div className="flex flex-col gap-1">
													<p className="recent-file-name">{file.name}</p>
													<FormattedDateTime
														date={new Date(file.createdAt).toISOString()}
														className="caption"
													/>
												</div>
												<ActionDropdown file={file} />
											</div>
										</div>
									))}
								</ul>
							</div>
						))}
					</div>
				) : (
					<p className="empty-list">No files uploaded</p>
				)}
			</section>
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
}
