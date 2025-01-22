"use client";

import { actionsDropdownItems } from "@/constants";
import { ActionType, DropDownProps } from "@/types/types";
import { Dialog } from "@repo/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import Image from "next/image";
import { useState } from "react";
import { bucketObjectAction } from "@/hooks/bucket-file-action";

const ActionDropdown = ({ file }: DropDownProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);

	const { objectAction } = bucketObjectAction();

	const handleDownload = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (file.bucketField) {
			await objectAction(file.bucketField, true);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger className="shad-no-focus">
					<Image
						src="/assets/icons/dots.svg"
						alt="dots"
						width={20}
						height={20}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel className="max-w-[200px] truncate">
						{file.name}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actionsDropdownItems.map((actionItem) => (
						<DropdownMenuItem
							key={actionItem.value}
							className="shad-dropdown-item"
							onClick={() => {
								setAction(actionItem);

								if (
									["rename", "share", "delete", "details"].includes(
										actionItem.value,
									)
								) {
									setIsModalOpen(true);
								}
							}}
						>
							<div className="flex items-center gap-2" onClick={handleDownload}>
								<Image
									src={actionItem.icon}
									alt={actionItem.label}
									width={30}
									height={30}
								/>
								{actionItem.label}
							</div>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</Dialog>
	);
};

export default ActionDropdown;

//"use client";

// import { actionsDropdownItems } from "@/constants";
// import { usePreURL } from "@/hooks/pre-signed-url";
// import { ActionType, DropDownProps } from "@/types/types";
// import { Dialog } from "@repo/ui/dialog";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuLabel,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from "@repo/ui/dropdown";
// import Image from "next/image";
// import { useState } from "react";

// const ActionDropdown = ({ file }: DropDownProps) => {
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// 	const [action, setAction] = useState<ActionType | null>(null);
// 	const { url, fetchPreSignedURL } = usePreURL();

// 	const handleAction = async (actionType: string) => {
// 		if (!file.bucketField) return;

// 		const isDownload = actionType === "download";
// 		const { success, url } = await fetchPreSignedURL(
// 			file.bucketField,
// 			isDownload,
// 		);

// 		if (success && url) {
// 			if (actionType === "view") {
// 				window.open(url, "_blank"); // Open in a new tab
// 			} else if (actionType === "download") {
// 				const a = document.createElement("a");
// 				a.href = url;
// 				a.download = file.name; // Set download filename
// 				document.body.appendChild(a);
// 				a.click();
// 				document.body.removeChild(a);
// 			}
// 		} else {
// 			console.error("Failed to fetch the pre-signed URL.");
// 		}
// 	};

// 	return (
// 		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
// 			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
// 				<DropdownMenuTrigger className="shad-no-focus">
// 					<Image
// 						src="/assets/icons/dots.svg"
// 						alt="dots"
// 						width={20}
// 						height={20}
// 					/>
// 				</DropdownMenuTrigger>
// 				<DropdownMenuContent>
// 					<DropdownMenuLabel className="max-w-[200px] truncate">
// 						{file.name}
// 					</DropdownMenuLabel>
// 					<DropdownMenuSeparator />
// 					{actionsDropdownItems.map((actionItem) => (
// 						<DropdownMenuItem
// 							key={actionItem.value}
// 							className="shad-dropdown-item"
// 							onClick={() => handleAction(actionItem.value)}
// 						>
// 							<div className="flex items-center gap-2">
// 								<Image
// 									src={actionItem.icon}
// 									alt={actionItem.label}
// 									width={30}
// 									height={30}
// 								/>
// 								{actionItem.label}
// 							</div>
// 						</DropdownMenuItem>
// 					))}
// 				</DropdownMenuContent>
// 			</DropdownMenu>
// 		</Dialog>
// 	);
// };

// export default ActionDropdown;
