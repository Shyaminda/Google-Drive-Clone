import express from "express";
import asyncHandler from "../utils/handler";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import {
	preFileController,
	getFilesController,
	uploadController,
	renameFileController,
	shareFileAccessController,
	shareFileAccessUpdateController,
	fileAccessPermissionController,
} from "../controllers/file.controller";
import authMiddleware from "../middleware/authMiddleware";
import { checkFilePermission } from "../middleware/permissionMiddleware";

const fileRouter = express.Router();

fileRouter.post("/upload", uploadMiddleware, asyncHandler(uploadController));
fileRouter.get("/", authMiddleware(), asyncHandler(getFilesController));
fileRouter.post("/access", authMiddleware(), asyncHandler(preFileController));
fileRouter.post(
	"/rename",
	authMiddleware(),
	checkFilePermission(),
	asyncHandler(renameFileController),
);
fileRouter.post(
	"/share",
	authMiddleware(),
	checkFilePermission(),
	asyncHandler(shareFileAccessController),
);
fileRouter.post(
	"/access/update",
	authMiddleware(),
	checkFilePermission(),
	asyncHandler(shareFileAccessUpdateController),
);

fileRouter.get(
	"/p",
	authMiddleware(),
	asyncHandler(fileAccessPermissionController),
);

export default fileRouter;
