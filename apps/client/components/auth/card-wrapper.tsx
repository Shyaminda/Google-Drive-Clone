"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/card";
import { BackButton } from "@/components/auth/back-button";
import { Header } from "./header";

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	formLabel: string;
}

export const CardWrapper = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	formLabel,
}: CardWrapperProps) => {
	return (
		<Card className="w-[400px] shadow-md">
			<CardHeader>
				<Header label={headerLabel} formLabel={formLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	);
};
