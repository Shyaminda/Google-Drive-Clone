import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
	isOAuth: boolean;
	email: string;
	token?: string;
	//customField: string; //if we want to add custom fields to user object
};
declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}

	interface User extends ExtendedUser {
		email: string;
		token?: string;
	}
}
