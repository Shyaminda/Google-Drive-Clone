import express from "express";
import asyncHandler from "../utils/handler";
import {
	createFolderController,
	deleteFolderController,
	getFoldersController,
	renameFolderController,
} from "../controllers/folder.controller";
import authMiddleware from "../middleware/authMiddleware";

const folderRouter = express.Router();

folderRouter.post("/", authMiddleware(), asyncHandler(createFolderController));

folderRouter.get("/", authMiddleware(), asyncHandler(getFoldersController));

folderRouter.post(
	"/rename",
	authMiddleware(),
	asyncHandler(renameFolderController),
);

folderRouter.delete(
	"/",
	authMiddleware(),
	asyncHandler(deleteFolderController),
);

export default folderRouter;
