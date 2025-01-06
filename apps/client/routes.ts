/**
 * An array of public routes that are accessible to all users.
 * These routes do not need authentication.
 * @types {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings
 * @types {string[]}
 */

export const authRoutes = [
	"/auth/login",
	"/auth/register",
	"/auth/error",
	"/auth/reset",
	"/auth/new-password",
];

/**
 * The prefix for all API routes.
 * Routes that start with this prefix are used for API authentication purposes
 * @types {string}
 */

export const apiAuthPrefix = "/api/v1/auth";

/**
 * The default redirect path after logging in
 * @types {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/";
