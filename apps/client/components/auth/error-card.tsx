import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
	return (
		<CardWrapper
			headerLabel="Oops something went wrong"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
			formLabel="Error"
		>
			<div className="flex w-full justify-center items-center">
				<ExclamationTriangleIcon className="text-destructive" />
			</div>
		</CardWrapper>
	);
};
