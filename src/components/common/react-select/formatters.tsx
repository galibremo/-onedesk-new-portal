import * as React from "react";
import { type GroupBase } from "react-select";
// Import directly from react-select's useCreatable instead of node_modules path
import { type CreatableProps } from "react-select/creatable";

/**
 * This hook could be added to your select component if needed:
 *   const formatters = useFormatters()
 *   <Select
 *     // other props
 *     {...formatters}
 *   />
 */
export const useFormatters = () => {
	// useful for CreatableSelect
	const formatCreateLabel: CreatableProps<
		unknown,
		false,
		GroupBase<unknown>
	>["formatCreateLabel"] = (label: string) => (
		<span className={"text-sm"}>
			Add
			<span className={"font-semibold"}>{` "${label}"`}</span>
		</span>
	);

	// useful for GroupedOptions
	const formatGroupLabel: (group: GroupBase<unknown>) => React.ReactNode = data => (
		<div className={"flex items-center justify-between"}>
			<span>{data.label}</span>
			<span
				className={
					"bg-secondary text-secondary-foreground rounded-md px-1 text-xs font-normal shadow-sm"
				}
			>
				{data.options.length}
			</span>
		</div>
	);

	return {
		formatCreateLabel,
		formatGroupLabel
	};
};

