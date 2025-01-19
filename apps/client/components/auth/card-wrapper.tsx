"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/card";
import { BackButton } from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { CardWrapperProps } from "@/types/types";

export const CardWrapper = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	formLabel,
	showSocial,
}: CardWrapperProps) => {
	return (
		<Card className="w-[400px] shadow-md">
			<CardHeader>
				<Header label={headerLabel} formLabel={formLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial && (
				<CardContent>
					<Social />
				</CardContent>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	);
};
