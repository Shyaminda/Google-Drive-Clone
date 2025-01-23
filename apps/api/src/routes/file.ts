import express from "express";
import asyncHandler from "../utils/handler";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import {
	preFileController,
	getFilesController,
	uploadController,
	renameFileController,
} from "../controllers/file.controller";
import authMiddleware from "../middleware/authMiddleware";

const fileRouter = express.Router();

fileRouter.post("/upload", uploadMiddleware, asyncHandler(uploadController));
fileRouter.get("/", authMiddleware(), asyncHandler(getFilesController));
fileRouter.post("/action", authMiddleware(), asyncHandler(preFileController));
fileRouter.post(
	"/rename",
	authMiddleware(),
	asyncHandler(renameFileController),
);

export default fileRouter;
