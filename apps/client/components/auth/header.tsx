interface HeaderProps {
	label: string;
	formLabel: string;
}

export const Header = ({ label, formLabel }: HeaderProps) => {
	return (
		<div className="flex items-center w-full gap-y-4 flex-col">
			<h1 className="text-3xl font-bold">{formLabel}</h1>
			<p className="text-muted-foreground text-sm">{label}</p>
		</div>
	);
};
