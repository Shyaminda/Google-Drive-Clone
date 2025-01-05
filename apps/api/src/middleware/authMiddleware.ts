// import { Response, NextFunction } from "express";
// import { getToken } from "next-auth/jwt";
// import { IncomingMessage } from "http";

// const secret = process.env.AUTH_SECRET as string;

// export interface AuthenticatedRequest extends Request {
// 	user?: {
// 		email?: string | null;
// 		cookies?: Partial<{ [key: string]: string }>;
// 	};
// }

// export const authenticateUser = async (
// 	req: AuthenticatedRequest,
// 	res: Response,
// 	next: NextFunction,
// ) => {
// 	try {
// 		const token = await getToken({
// 			req: req as unknown as IncomingMessage & {
// 				cookies: Partial<{ [key: string]: string }>;
// 			},
// 			secret,
// 		});
// 		if (token) {
// 			req.user = { email: token.email };
// 			return next();
// 		}
// 		res.status(401).json({ error: "Unauthorized" });
// 	} catch {
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// };

import { Request, Response, NextFunction } from "express";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET as string;

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	try {
		const token = await getToken({ req, secret });
		if (token) {
			(req as any).user = token;
			return next();
		}
		return res.status(401).json({ error: "Unauthorized" });
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
