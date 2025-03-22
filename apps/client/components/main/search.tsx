"use client";

import { fetchFiles } from "@/hooks/fetch-files";
import { File } from "@/types/types";
import { getFileTypesParams } from "@/utils/utils";
import { Input } from "@repo/ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Thumbnail from "../ui/Thumbnail";
import FormattedDateTime from "./formattedDateTime";
import { debounce } from "lodash";
import { Button } from "@repo/ui/button";
import { resetFolderState } from "@repo/common";
import { useDispatch } from "react-redux";

const Search = () => {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<File[]>([]);
	const [open, setOpen] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [cursor, setCursor] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("search") || "";
	const pathname = usePathname();

	const dispatch = useDispatch();

	useEffect(() => {
		if (!searchQuery) {
			setSearch("");
		}
	}, [searchQuery]);

	console.log("cursor:", cursor);
	const debouncedFetch = useMemo(() => {
		return debounce(async (search, fileTypes, cursor) => {
			if (!search.trim()) return;
			try {
				const files = await fetchFiles(
					fileTypes.join(","),
					"4",
					"date-newest",
					search,
					cursor,
				);
				console.log("Files searched:", files);
				setResults((prev) =>
					cursor ? [...prev, ...(files?.files || [])] : files?.files || [],
				);
				setCursor(files.nextCursor);
				console.log("Results:", results);
				setCursor(files.nextCursor);
				setHasMore(!!files.nextCursor);
				setOpen(true);
			} catch (error) {
				console.error("Error fetching search results:", error);
			}
		}, 500);
	}, []);

	useEffect(() => {
		if (hasSearched) return;

		const pathType = pathname.split("/").filter(Boolean);
		console.log("Path type:", pathType);
		const filteredTypeFromPath = pathType.length > 0 ? pathType[0] : "";

		const fileTypes = getFileTypesParams(filteredTypeFromPath || "");
		console.log("File types search:", fileTypes);
		try {
			debouncedFetch(search, fileTypes, cursor);
			console.log("Fetching search results...");
		} catch (error) {
			console.error("Error fetching search results:", error);
		}

		return () => {
			debouncedFetch.cancel();
			setCursor(null);
			setResults([]);
		};
	}, [search, pathname, hasSearched, debouncedFetch]);

	const handleClickSearch = async (file: File) => {
		setResults([]);
		setHasSearched(true);
		setOpen(false);
		router.push(`/${file.type.toLowerCase() + "s"}?f=${file.id}`);
		// dispatch(resetFolderState());
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		setHasSearched(false);
		setCursor(null);
		setResults([]);
		debouncedFetch.cancel();

		const pathType = pathname.split("/").filter(Boolean)[0] || "";

		if (value.trim() === "") {
			setResults([]);
			setOpen(false);
			setHasSearched(false);

			if (pathType) {
				router.push(`/${pathType}`);
			}
		}
	};

	const handleLoadMore = () => {
		if (!cursor || !hasMore) return;
		const pathType = pathname.split("/").filter(Boolean)[0] || "";
		const fileTypes = getFileTypesParams(pathType || "");
		debouncedFetch(search, fileTypes, cursor);
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
							<p className="empty-result">No files found</p>
						)}
						{hasMore && (
							<Button variant="link" onClick={handleLoadMore}>
								Load More
							</Button>
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Search;

//TODO: add state resets for error handling
//TODO: add scroll area for search results
