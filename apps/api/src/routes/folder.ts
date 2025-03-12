import express from "express";
import asyncHandler from "../utils/handler";
import { createFolderController } from "../controllers/folder.controller";
import authMiddleware from "../middleware/authMiddleware";

const folderRouter = express.Router();

folderRouter.post("/", authMiddleware(), asyncHandler(createFolderController));

export default folderRouter;
