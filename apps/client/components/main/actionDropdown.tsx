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
import { fileRenameAction, fileShareAction } from "@/hooks/file-action";
import { FileDetails, ShareFile } from "@/components/main/actionsModalContent";
import { deleteFile } from "@/hooks/delete-file";
import { revokeAccess } from "@/hooks/revoke-access";

const ActionDropdown = ({ file }: DropDownProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [action, setAction] = useState<ActionType | null>(null);
	const [name, setName] = useState(file.name);
	const [isLoading, setIsLoading] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [emails, setEmails] = useState<string[]>([]);
	const [grantPermissions, setGrantPermissions] = useState<string[]>([]);

	const { objectAccess } = bucketObjectAccess();

	const handleAction = async (e: React.MouseEvent, actionItem: ActionType) => {
		e.preventDefault();
		e.stopPropagation();

		if (actionItem.value === "download" && file.bucketField) {
			const requestedPermission = actionItem.value.trim().toUpperCase();
			await objectAccess(file.bucketField, true, requestedPermission, file.id);
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
				case "rename": {
					const requestingPermission = action.value.trim().toUpperCase();
					await fileRenameAction(
						file.bucketField,
						name,
						file.id,
						requestingPermission,
					);
					console.log("action value:", action.value);
					setIsModalOpen(false);
					break;
				}

				case "share": {
					if (emails.length === 0) {
						throw new Error("Please provide at least one email.");
					}
					const requestingPermission = action.value.trim().toUpperCase();
					await fileShareAction(
						file.id,
						emails,
						grantPermissions,
						requestingPermission,
					);
					setIsModalOpen(false);
					break;
				}
				case "delete": {
					await deleteFile(file.id);
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

	const handleRemoveUser = async (email: string) => {
		await revokeAccess(email, file.id);
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
					{action.value === "details" && <FileDetails file={file} />}
					{action.value === "share" && (
						<ShareFile
							file={file}
							onInputChange={setEmails}
							onRemove={handleRemoveUser}
							onPermissionChange={setGrantPermissions} //checkbox permissions
						/>
					)}
					{action.value === "delete" && (
						<p className="delete-confirmation">
							Are you sure you want to delete{` `}
							<span className="delete-file-name">{file.name}</span>?
						</p>
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
				<DropdownMenuContent>
					<DropdownMenuLabel className="max-w-[200px] truncate">
						{file.name}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{actionsDropdownItems.map((actionItem) => (
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

export default ActionDropdown;
//TODO: when rename function is open only select the file name don't select the extension
//TODO: show the renamed file instantaneously without refreshing the page
//TODO: add loading function for download action
//TODO: download the file with the original name shown in the app
