import baseConfig from "@repo/ui/tailwind.config";
import type { Config } from "tailwindcss";

const tailwindConfig: Config = {
	...baseConfig,
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
};

export default tailwindConfig;
