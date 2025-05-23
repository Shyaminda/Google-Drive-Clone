import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "100mb",
		},
	},
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.freepik.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "driveway-store.s3.us-east-1.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "d2c31yv0tsgha3.cloudfront.net",
			},
		],
	},
};

export default nextConfig;
