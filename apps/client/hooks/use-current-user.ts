import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
	const session = useSession();

	if (session) {
		return session.data?.user;
	}
};
