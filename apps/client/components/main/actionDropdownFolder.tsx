/* eslint-disable indent */
"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import { folderRename } from "@/hooks/rename-folder";
import { ActionType, FolderActionDropdownProps } from "@/types/types";
import { deleteFolder } from "@/hooks/delete-folder";
import { actionsDropdownItems } from "@/constants";
import { actionsDropdownItemsFolder } from "../../constants";

const FolderActionDropdown = ({ folder }: FolderActionDropdownProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(folder.name);
	const [isLoading, setIsLoading] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleAction = async (e: React.MouseEvent, actionItem: ActionType) => {
		e.preventDefault();
		e.stopPropagation();

		if (["rename", "share", "delete", "details"].includes(actionItem.value)) {
			setAction(actionItem);
			setIsModalOpen(true);
			setIsDropdownOpen(false);
		}
	};

	const handleActionSubmit = async () => {
		if (!action) return;

		setIsLoading(true);
		try {
			switch (action.value) {
				case "rename": {
					await folderRename(folder.id, name);
					setIsModalOpen(false);
					break;
				}

				case "delete": {
					await deleteFolder(folder.id);
					setIsModalOpen(false);
					break;
				}
			}
		} catch (err) {
			console.error(`Error performing ${action.value}:`, err);
		} finally {
			setIsLoading(false);
		}
	};

	const closeAllModels = () => {
		setIsModalOpen(false);
		setAction(null);
		setIsDropdownOpen(false);
	};

	const renderDialogContent = () => {
		if (!action) return null;
		return (
			<DialogContent
				className="shad-dialog button"
				onClick={(e) => e.stopPropagation()}
			>
				<DialogHeader className="flex flex-col gap-3">
					<DialogTitle className="text-center text-light-100">{`${action.label}`}</DialogTitle>
					{action.value === "rename" && (
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					)}

					{action.value === "delete" && (
						<p className="delete-confirmation">
							Are you sure you want to delete folder{` `}
							<span className="delete-file-name">{folder.name}</span>?
						</p>
					)}
				</DialogHeader>
				{["delete", "rename"].includes(action.value) && (
					<DialogFooter className="flex flex-col gap-3 md:flex-row">
						<Button
							className="modal-cancel-button"
							onClick={closeAllModels}
							variant="normal"
						>
							Cancel
						</Button>
						<Button
							onClick={handleActionSubmit}
							className="modal-submit-button"
							// disabled={
							// 	action.value === "share" && grantPermissions.length === 0
							// }
						>
							<p className="capitalize">{action.value}</p>
							{isLoading && (
								<Image
									src="/assets/icons/loader.svg"
									alt="loader"
									width={24}
									height={24}
									className="animate-spin"
								/>
							)}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		);
	};

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={(isOpen) => {
				setIsModalOpen(isOpen);
				if (!isOpen) {
					setAction(null);
				}
			}}
		>
			<DropdownMenu
				open={isDropdownOpen}
				onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
			>
				<DropdownMenuTrigger className="shad-no-focus">
					<Image
						src="/assets/icons/dots.svg"
						alt="dots"
						width={20}
						height={20}
						onClick={() => setIsDropdownOpen(true)}
						className="cursor-pointer hover:bg-slate-200 rounded-full size-9 p-2 hover:ease-in-out duration-200"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuSeparator />
				<DropdownMenuContent>
					{actionsDropdownItemsFolder.map((actionItem) => (
						<DropdownMenuItem
							key={actionItem.value}
							className="shad-dropdown-item hover:ease-in-out hover:scale-105 hover:font-medium transition-transform duration-200"
							onClick={(e) => handleAction(e, actionItem)}
						>
							<div className="flex items-center gap-2">
								<Image
									src={actionItem.icon}
									alt={actionItem.label}
									width={30}
									height={30}
									onClick={(e) => e.preventDefault()}
								/>
								{actionItem.label}
							</div>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{renderDialogContent()}
		</Dialog>
	);
};

export default FolderActionDropdown;
