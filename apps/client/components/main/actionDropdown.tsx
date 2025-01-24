/* eslint-disable indent */
"use client";

import { actionsDropdownItems } from "@/constants";
import { ActionType, DropDownProps } from "@/types/types";
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
import Image from "next/image";
import { useState } from "react";
import { bucketObjectAccess } from "@/hooks/bucket-file-action";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { fileRenameAction } from "@/hooks/file-action";

const ActionDropdown = ({ file }: DropDownProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(file.name);
	const [isLoading, setIsLoading] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const { objectAccess } = bucketObjectAccess();

	const handleAction = async (e: React.MouseEvent, actionItem: ActionType) => {
		e.preventDefault();
		e.stopPropagation();

		if (actionItem.value === "download" && file.bucketField) {
			await objectAccess(file.bucketField, true);
			setIsDropdownOpen(false);
		} else if (
			["rename", "share", "delete", "details"].includes(actionItem.value)
		) {
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
				case "rename":
					await fileRenameAction(file.bucketField, name);
					setIsModalOpen(false);
					break;
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
				</DialogHeader>
				{["share", "delete", "rename"].includes(action.value) && (
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

export default ActionDropdown;
