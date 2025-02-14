import { ListViewProps } from "@/types/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/table";
import FormattedDateTime from "@/components/main/formattedDateTime";
import { convertFileSize } from "@/utils/utils";
import Thumbnail from "@/components/ui/Thumbnail";
import { bucketObjectAccess } from "@/hooks/bucket-file-action";
import ActionDropdown from "./actionDropdown";
import Image from "next/image";

const List = ({ file }: ListViewProps) => {
	const { objectAccess } = bucketObjectAccess();

	const handleView = async (
		e: React.MouseEvent,
		bucketField: string,
		id: string,
	) => {
		e.preventDefault();
		if (bucketField) {
			await objectAccess(bucketField, false, "VIEW", id);
		}
	};

	return (
		<div className="w-full overflow-x-auto">
			<div className="hidden md:block">
				<Table className="leading-8 w-full">
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead className="hidden lg:table-cell">Owner</TableHead>
							<TableHead className="hidden md:table-cell">
								Last modified
							</TableHead>
							<TableHead>File size</TableHead>
							<TableHead className="object-right">
								<Image
									src="/assets/icons/dots.svg"
									alt="dots"
									width={20}
									height={20}
									onClick={() => console.log("clicked")}
								/>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{file.map((file) => (
							<TableRow
								key={file.id}
								className="hover:bg-gray-300 cursor-pointer"
								onClick={(e) => handleView(e, file.bucketField, file.id)}
							>
								<TableCell className="flex items-center gap-4">
									<Thumbnail
										id={file.id}
										type={file.type}
										extension={file.extension}
										className="!size-12"
									/>
									{file.name}
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									{file.owner?.name || "Unknown"}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<FormattedDateTime
										date={new Date(file.updatedAt).toISOString()}
										className="body-2 text-light-100"
									/>
								</TableCell>
								<TableCell>{convertFileSize(file.size)}</TableCell>
								<TableCell>
									<ActionDropdown file={file} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="md:hidden flex flex-col gap-4">
				{file.map((file) => (
					<div
						key={file.id}
						className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
						onClick={(e) => handleView(e, file.bucketField, file.id)}
					>
						<div className="flex items-center gap-4">
							<Thumbnail
								id={file.id}
								type={file.type}
								extension={file.extension}
								className="size-12"
							/>
							<div>
								<p className="font-medium">{file.name}</p>
								<p className="text-sm text-gray-500">
									{convertFileSize(file.size)}
								</p>
							</div>
						</div>
						<ActionDropdown file={file} />
					</div>
				))}
			</div>
		</div>
	);
};

export default List;
