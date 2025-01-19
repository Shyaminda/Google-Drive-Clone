import { formatDateTime } from "@/utils/utils";
import { cn } from "@repo/ui/lib";

const FormattedDateTime = ({
	date,
	className,
}: {
	date: string;
	className?: string;
}) => {
	return (
		<p className={cn("body-1 text-light-200", className)}>
			{formatDateTime(date)}
		</p>
	);
};

export default FormattedDateTime;
