/* eslint-disable prettier/prettier */
import { sortTypes } from "@/constants";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import Image from "next/image";

const Sort = ({
	handleSortChange,
	isFolderSort = false,
}: {
	handleSortChange: (value: string) => void;
	isFolderSort?: boolean;
}) => {
	const filteredSortTypes = isFolderSort
		? sortTypes.filter(
				(sortType) =>
					sortType.value !== "size-largest" &&
					sortType.value !== "size-smallest",
			)
		: sortTypes;
	return (
		<Select onValueChange={handleSortChange}>
			<SelectTrigger
				className={`${isFolderSort ? "sort-select-folder" : "sort-select"} flex items-center gap-2`}
			>
				{isFolderSort ? (
					<Image
						src="/assets/icons/folder-sort.svg"
						alt="Folder Sort"
						width={20}
						height={20}
					/>
				) : (
					<SelectValue placeholder="Sort by" />
				)}
			</SelectTrigger>
			<SelectContent className="sort-select-content">
				{filteredSortTypes.map((sortType) => (
					<SelectItem
						key={sortType.value}
						value={sortType.value}
						className="shad-select-item hover:ease-in-out hover:scale-105 hover:font-medium transition-transform duration-200"
					>
						{sortType.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default Sort;
