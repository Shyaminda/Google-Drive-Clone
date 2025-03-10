import { readFileSync } from "fs";
import path from "path";
import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

const EXPIRATION_TIME_MS = 5 * 60 * 1000;

export const objectViewOnly = async (
	bucketField: string,
	res: any,
	timestamp: number,
) => {
	if (!bucketField) {
		res.status(400).json({ success: false, error: "Invalid bucketField" });
		return;
	}

	try {
		if (!timestamp) {
			res.status(400).json({ success: false, error: "Missing timestamp" });
			return;
		}

		const requestTime = Number(timestamp);
		const currentTime = Date.now();

		if (currentTime - requestTime > EXPIRATION_TIME_MS) {
			res.status(403).json({ success: false, error: "Access expired" });
			return;
		}

		const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
		// const privateKeyPath = path.resolve("private-key.pem");

		const privateKeyPath = process.env.CLOUDFRONT_PRIVATE_KEY_PATH;
		if (!privateKeyPath) {
			res
				.status(500)
				.json({ success: false, error: "Private key path is not defined" });
			return;
		}
		const privateKey = readFileSync(privateKeyPath, "utf8");

		const expires = Math.floor(Date.now() / 1000) + 60 * 60;
		const resourceUrl = `${cloudFrontDomain}/${bucketField}`;

		const policy = JSON.stringify({
			Statement: [
				{
					Resource: resourceUrl,
					Condition: { DateLessThan: { "AWS:EpochTime": expires } },
				},
			],
		});

		const signedCookies = getSignedCookies({
			url: resourceUrl,
			keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
			privateKey: privateKey,
			policy: policy,
		});

		res.cookie("CloudFront-Policy", signedCookies["CloudFront-Policy"], {
			httpOnly: false,
			secure: false,
			domain: `${process.env.CLOUDFRONT_DOMAIN_NO_PROTOCOL}`,
			path: "/",
			sameSite: "Lax",
		});

		res.cookie("CloudFront-Signature", signedCookies["CloudFront-Signature"], {
			httpOnly: false,
			secure: false,
			domain: `${process.env.CLOUDFRONT_DOMAIN_NO_PROTOCOL}`,
			path: "/",
			sameSite: "Lax",
		});

		const signedUrl = `${cloudFrontDomain}/${bucketField}`;
		res.json({ success: true, url: signedUrl });
	} catch (error) {
		console.error("Error generating CloudFront signed cookies:", error);
		res.status(500).json({ success: false, error: "Internal server error" });
	}
};
