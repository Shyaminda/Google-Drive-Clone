import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { List, Grid } from "lucide-react";
import { cn } from "../../lib/utils";

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			"relative flex h-8 w-20 shrink-0 cursor-pointer items-center rounded-full border border-gray-300 bg-gray-100 shadow-md transition-colors data-[state=checked]:bg-blue-100",
			className,
		)}
		{...props}
		ref={ref}
	>
		<div
			className={cn(
				"absolute left-1 flex items-center justify-center w-8 h-8 rounded-full transition-all",
				"data-[state=unchecked]:bg-slate-900 data-[state=checked]:bg-white",
			)}
		>
			<Grid className="w-5 h-5 text-gray-700" />
		</div>

		<div
			className={cn(
				"absolute right-1 flex items-center justify-center w-8 h-8 rounded-full transition-all",
				"data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-white",
			)}
		>
			<List className="w-5 h-5 text-brand-100" />
		</div>

		<SwitchPrimitives.Thumb
			className={cn(
				"pointer-events-none absolute block h-6 w-8 rounded-full bg-brand-100 shadow-md ring-0 transition-transform",
				"data-[state=checked]:translate-x-10 data-[state=unchecked]:translate-x-1 ease-out duration-200",
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
