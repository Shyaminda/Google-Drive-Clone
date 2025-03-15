import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { createFolder } from "@/hooks/create-folder";
import { BeatLoader } from "react-spinners";
import { CreateFolderProps } from "@/types/types";
import { useSelector } from "react-redux";
import { RootState } from "@repo/common/src/store/store";
import { openedFolder } from "@repo/common";

export const CreateFolder = ({ type }: CreateFolderProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [folderName, setFolderName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const openedFolderState = useSelector((state: RootState) =>
		openedFolder(state),
	);

	const parentId = openedFolderState?.id || undefined;
	console.log("Opened folder create folder:", openedFolderState?.id);

	const handleDialogOpen = () => {
		setIsDialogOpen(true);
		setFolderName("");
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
	};

	const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderName(e.target.value);
	};

	const handleCreateFolder = async () => {
		if (!folderName.trim()) return;

		setIsLoading(true);
		try {
			await createFolder(folderName, type, parentId);
			handleDialogClose();
		} catch (error) {
			console.error("Failed to create folder:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Image
				src="/assets/icons/add-folder.svg"
				alt="add folder"
				width={23}
				height={23}
				className="h-auto cursor-pointer transition-all hover:scale-110 ease-in-out duration-200"
				onClick={handleDialogOpen}
			/>

			<Dialog
				open={isDialogOpen}
				onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
			>
				<DialogContent>
					<DialogTitle>Create Folder</DialogTitle>
					<Input
						className="font-medium"
						placeholder="Folder Name"
						value={folderName}
						onChange={handleFolderNameChange}
					/>
					<Button
						variant="normal"
						onClick={handleCreateFolder}
						className="mt-4"
						disabled={isLoading}
					>
						{isLoading ? (
							<BeatLoader size={12} color="#ffffff" />
						) : (
							"Create Folder"
						)}
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
};
