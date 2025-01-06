import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "@/data/user";
import { prisma } from "@/lib/db";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: "/auth/login", //this is the path to the login page always
		error: "/auth/error", //this is the path to the error page always
	},
	events: {
		async linkAccount({ user }) {
			await prisma.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() }, //users who login with google or github will have their email verified already so we can set emailVerified to current date no need verify the email again
			});
		},
	},
	callbacks: {
		async signIn({ account }) {
			//console.log("sign in callback", user, account); //also we can use type instead of provider check the console log
			if (account?.provider !== "credentials") return true; //Allow OAuth without email verification

			// if (!user.id) return false;
			// const existingUser = await getUserById(user.id);

			// //prevent login if email is not verified
			// if (!existingUser?.emailVerified) return false;

			return true;
		},
		async session({ session, token }) {
			if (token.sub && session.user) {
				//here sub is the user id
				session.user.id = token.sub; //this is how we extract user id from token
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email || "";
				//@ts-expect-error //this is a next auth issue
				session.user.isOAuth = token.isOAuth as boolean;
			}
			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.name = existingUser.name;
			token.email = existingUser.email;

			return token;
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
});
