"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { BackButtonProps } from "@/types/types";

export const BackButton = ({ label, href }: BackButtonProps) => {
	return (
		<Button variant="link" className="w-full font-normal" size="sm" asChild>
			<Link href={href}>{label}</Link>
		</Button>
	);
};
