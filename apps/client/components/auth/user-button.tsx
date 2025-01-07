import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
	const user = useCurrentUser();

	return (
		<LogoutButton>
			<ExitIcon className="h-4 w-4 mr-2" />
			Logout {user?.name}
		</LogoutButton>
	);
};
