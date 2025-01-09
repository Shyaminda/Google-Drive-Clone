import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { hkdf } from "@panva/hkdf";
import { jwtDecrypt } from "jose";
dotenv.config();

interface AuthenticatedRequest extends Request {
	userId?: string;
}

const deriveEncryptionKey = async (secret: string, salt: string) => {
	const length = 64;
	return hkdf(
		"sha256",
		secret,
		salt,
		`Auth.js Generated Encryption Key (${salt})`,
		length,
	);
};

const authMiddleware = () => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const token =
			req.headers.authorization?.split(" ")[1] ||
			req.cookies?.["authjs.session-token"];

		if (!token) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}
		try {
			const encryptionKey = await deriveEncryptionKey(
				process.env.NEXTAUTH_SECRET!,
				"authjs.session-token",
			);

			const { payload } = await jwtDecrypt(token, encryptionKey, {
				clockTolerance: "15s",
				contentEncryptionAlgorithms: ["A256CBC-HS512"],
			});

			if (!payload.sub) {
				res
					.status(403)
					.json({ error: "Token does not contain a valid user ID" });
				return;
			}

			req.userId = payload.sub;
			next();
		} catch (error) {
			console.error("JWT Verification Error:", error);
			res.status(403).json({ error: "Invalid or expired token" });
			return;
		}
	};
};

export default authMiddleware;
