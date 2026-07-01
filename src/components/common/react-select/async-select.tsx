import * as React from "react";
import type { AsyncProps } from "react-select/async";
import type { GroupBase } from "react-select";
import AsyncSelectComponent from "react-select/async";

import {
	ClearIndicator,
	DropdownIndicator,
	Menu,
	MenuList,
	MultiValueRemove,
	Option
} from "./custom-components";
import { defaultClassNames, defaultStyles } from "./styles";

const AsyncSelect = React.forwardRef<
	React.ElementRef<typeof AsyncSelectComponent>,
	React.ComponentPropsWithoutRef<typeof AsyncSelectComponent>
>((props: AsyncProps<unknown, boolean, GroupBase<unknown>>, ref) => {
	const {
		value,
		onChange,
		loadOptions,
		styles = defaultStyles,
		classNames = defaultClassNames,
		components = {},
		...rest
	} = props;

	const id = React.useId();

	return (
		<AsyncSelectComponent
			instanceId={id}
			ref={ref}
			value={value}
			onChange={onChange}
			loadOptions={loadOptions}
			unstyled
			components={{
				DropdownIndicator,
				ClearIndicator,
				MultiValueRemove,
				Option,
				Menu,
				MenuList,
				...components
			}}
			styles={styles}
			classNames={classNames}
			{...rest}
		/>
	);
});
AsyncSelect.displayName = "AsyncSelect";

export { AsyncSelect };
export default AsyncSelect;
