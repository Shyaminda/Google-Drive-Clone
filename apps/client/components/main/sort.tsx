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
