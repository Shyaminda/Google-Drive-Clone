"use client";

import { fetchFiles } from "@/hooks/fetch-files";
import { File } from "@/types/types";
import { getFileTypesParams } from "@/utils/utils";
import { Input } from "@repo/ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Thumbnail from "../ui/Thumbnail";
import FormattedDateTime from "./formattedDateTime";

const Search = () => {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<File[]>([]);
	const [open, setOpen] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("search") || "";
	const pathname = usePathname();

	useEffect(() => {
		if (!searchQuery) {
			setSearch("");
		}
	}, [searchQuery]);

	useEffect(() => {
		if (!search.trim() || hasSearched) return;

		const delaySearch = setTimeout(async () => {
			const pathType = pathname.split("/").filter(Boolean);
			console.log("Path type:", pathType);
			const filteredTypeFromPath = pathType.length > 0 ? pathType[0] : "";

			const fileTypes = getFileTypesParams(filteredTypeFromPath || "");
			console.log("File types:", fileTypes);
			try {
				const files = await fetchFiles(
					fileTypes.join(","),
					"10",
					"asc",
					search,
				);
				console.log("Files search:", files);
				setResults(files);
				setOpen(true);
			} catch (error) {
				console.error("Error fetching search results:", error);
			}
		}, 500);

		return () => clearTimeout(delaySearch);
	}, [search, pathname, hasSearched]);

	const handleClickSearch = async (file: File) => {
		setResults([]);
		setHasSearched(true);
		setOpen(false);
		router.push(`/${file.type.toLowerCase()}?f=${file.id}`);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		setHasSearched(false);

		let pathType = pathname.split("/").filter(Boolean)[0] || "";

		if (pathType === "audio" || pathType === "video") {
			pathType = "media";
		}

		const pathVariable = pathType === "media" ? pathType : pathType + "s";

		if (value.trim() === "") {
			setResults([]);
			setOpen(false);

			if (pathType) {
				router.push(`/${pathVariable}`);
			}
		}
	};

	return (
		<div className="search">
			<div className="search-input-wrapper">
				<Image
					src="/assets/icons/search.svg"
					alt="search"
					width={24}
					height={24}
				/>
				<Input
					value={search}
					placeholder="Search..."
					className="search-input"
					onChange={handleInputChange}
				/>

				{open && !hasSearched && search.trim() !== "" && (
					<ul className="search-result">
						{results.length > 0 ? (
							results.map((file) => (
								<li
									key={file.id}
									onClick={() => handleClickSearch(file)}
									className="flex items-center justify-between"
								>
									<div className="flex cursor-pointer items-center gap-4">
										<Thumbnail
											id={file.id}
											type={file.type}
											extension={file.extension}
											className="size-9 min-w-9"
										/>
										<p className="subtitle-2 line-clamp-1 text-light-100">
											{file.name}
										</p>
									</div>
									<FormattedDateTime
										date={new Date(file.createdAt).toISOString()}
										className="caption"
									/>
								</li>
							))
						) : (
							<p className="empty-result"> No files found</p>
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Search;
