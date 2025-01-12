import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export const createClientSession = async () => {
	const client = new Client()
		.setEndpoint(appwriteConfig.endpointUrl)
		.setProject(appwriteConfig.projectId);

	// Retrieve the session from cookies
	const session = (await cookies()).get("appwrite-session");

	if (!session || !session.value) {
		throw new Error("No session found");
	}

	client.setSession(session.value);

	return {
		account: new Account(client),
		databases: new Databases(client),
		storage: new Storage(client), // Added storage for user-based uploads
		avatars: new Avatars(client), // Optional: Only if needed
	};
};
