import { sortTypes } from "@/constants";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";

const Sort = ({ setSort }: { setSort: (value: string) => void }) => {
	return (
		<Select onValueChange={setSort}>
			<SelectTrigger className="sort-select">
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent className="sort-select-content">
				{sortTypes.map((sortType) => (
					<SelectItem
						key={sortType.value}
						value={sortType.value}
						className="shad-select-item"
					>
						{sortType.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default Sort;
