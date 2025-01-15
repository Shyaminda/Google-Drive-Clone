import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
	isOAuth: boolean;
	email: string;
	//customField: string; //if we want to add custom fields to user object
};
declare module "@auth/core" {
	interface Session {
		user: ExtendedUser;
	}

	interface User {
		email: string;
	}
}
