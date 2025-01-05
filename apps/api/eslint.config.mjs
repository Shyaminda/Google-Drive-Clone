import { nextJsConfig } from "@repo/eslint-config/next-js";

/**
 * Extend the shared Next.js ESLint configuration.
 */
export default [
	...nextJsConfig.filter((config) => {
		// Exclude React- and Next.js-specific rules/plugins
		const excludedPlugins = ["react-hooks", "@next/next"];
		return !(
			(config.plugins &&
				excludedPlugins.some((plugin) => plugin in config.plugins)) ||
			(config.rules &&
				Object.keys(config.rules).some(
					(rule) => rule.startsWith("react") || rule.startsWith("@next/"),
				))
		);
	}),
	{
		files: ["**/*.ts", "**/*.js"],
		languageOptions: {
			globals: {
				__dirname: "readonly",
				require: "readonly",
				module: "readonly",
				process: "readonly",
			},
		},
		rules: {
			"prettier/prettier": "warn",
		},
	},
];
