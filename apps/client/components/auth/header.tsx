import { Poppins } from "next/font/google";
import { cn } from "@repo/ui/lib";

const font = Poppins({
	subsets: ["latin"],
	weight: ["600"],
});

interface HeaderProps {
	label: string;
}

export const Header = ({ label }: HeaderProps) => {
	return (
		<div className="flex items-center w-full gap-y-4 flex-col">
			<h1 className={cn("text-3xl font-semibold", font.className)}>🔐 Auth</h1>
			<p className="text-muted-foreground text-sm">{label}</p>
		</div>
	);
};
