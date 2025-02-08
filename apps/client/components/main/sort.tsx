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
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="name-asc">Name (A-Z)</SelectItem>
				<SelectItem value="name-desc">Name (Z-A)</SelectItem>
				<SelectItem value="date-newest">Newest</SelectItem>
				<SelectItem value="date-oldest">Oldest</SelectItem>
				<SelectItem value="size-largest">Largest</SelectItem>
				<SelectItem value="size-smallest">Smallest</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default Sort;
