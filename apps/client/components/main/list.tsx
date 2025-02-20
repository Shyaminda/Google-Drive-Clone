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
import ActionDropdown from "./actionDropdown";
import Image from "next/image";

const List = ({ file, onClick }: ListViewProps) => {
	console.log("Files from list:", file);
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
								/>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{file.map((singleFile) => (
							<TableRow
								key={singleFile.id}
								className="hover:bg-gray-300 cursor-pointer"
								onClick={() =>
									onClick(
										singleFile.id,
										singleFile.bucketField,
										singleFile.type,
										singleFile.name,
									)
								}
							>
								<TableCell className="flex items-center gap-4">
									<Thumbnail
										id={singleFile.id}
										type={singleFile.type}
										extension={singleFile.extension}
										className="!size-12"
									/>
									{singleFile.name}
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									{singleFile.owner?.name || "Unknown"}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<FormattedDateTime
										date={new Date(singleFile.updatedAt).toISOString()}
										className="body-2 text-light-100"
									/>
								</TableCell>
								<TableCell>{convertFileSize(singleFile.size)}</TableCell>
								<TableCell>
									<ActionDropdown file={singleFile} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="md:hidden flex flex-col gap-4">
				{file.map((singleFile) => (
					<div
						key={singleFile.id}
						className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
						onClick={() =>
							onClick(
								singleFile.id,
								singleFile.bucketField,
								singleFile.type,
								singleFile.name,
							)
						}
					>
						<div className="flex items-center gap-4">
							<Thumbnail
								id={singleFile.id}
								type={singleFile.type}
								extension={singleFile.extension}
								className="size-12"
							/>
							<div>
								<p className="font-medium">{singleFile.name}</p>
								<p className="text-sm text-gray-500">
									{convertFileSize(singleFile.size)}
								</p>
							</div>
						</div>
						<ActionDropdown file={singleFile} />
					</div>
				))}
			</div>
		</div>
	);
};

export default List;
