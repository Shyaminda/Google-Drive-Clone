import { Request } from "express";
import { type as PrismaType } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
	userId?: string;
	email?: string;
}

export interface FileUploadRequest {
	files: Express.MulterS3.File[];
	ownerId: string;
	folderId?: string;
}

export interface GetFilesProps {
	currentUser: { id: string; email: string };
	type?: PrismaType[];
	searchText?: string;
	sort?: string;
	limit?: number;
	cursor?: string;
	folderId?: string;
}

export interface GetFileProps {
	userId: string;
	fileId: string;
	type: PrismaType[];
}

export interface AuthenticatedRequest extends Request {
	userId?: string;
	email?: string;
}
