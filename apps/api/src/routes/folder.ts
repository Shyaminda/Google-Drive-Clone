import express from "express";
import asyncHandler from "../utils/handler";
import {
	createFolderController,
	getFoldersController,
} from "../controllers/folder.controller";
import authMiddleware from "../middleware/authMiddleware";

const folderRouter = express.Router();

folderRouter.post("/", authMiddleware(), asyncHandler(createFolderController));

folderRouter.get("/", authMiddleware(), asyncHandler(getFoldersController));

export default folderRouter;
