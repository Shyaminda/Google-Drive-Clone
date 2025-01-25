import { Request } from "express";
import { type as PrismaType } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
	userId?: string;
	email?: string;
}

export interface FileUploadRequest {
	files: Express.MulterS3.File[];
	ownerId: string;
}

export interface GetFilesProps {
	currentUser: { id: string; email: string };
	type?: PrismaType[];
	//searchText?: string;
	sort?: string;
	limit?: number;
}

export interface AuthenticatedRequest extends Request {
	userId?: string;
	email?: string;
}
