"use client";

import { Cancel01Icon, RefreshIcon, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import { cn } from "@/lib/utils";

import { DataTableSingleSelectFacetedFilter } from "@/components/common/table/data-table-single-select-faceted-filter";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useTeamMembersList } from "@/features/team-details/team-members/hooks/use-team-members-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface TeamMembersDataTableToolbarProps<TData> {
	table: Table<TData>;
}

const teamMemberRoleFilterOptions = [
	{ label: "Team Lead", value: "TEAM_LEAD" },
	{ label: "Agent", value: "AGENT" }
];

export function TeamMembersDataTableToolbar<TData>({
	table
}: TeamMembersDataTableToolbarProps<TData>) {
	const {
		search,
		role,
		isFetching,
		handleSearchChange,
		handleRoleChange,
		handleOptionFilter,
		handleResetAll,
		handleRefresh
	} = useTeamMembersList();
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const hasFilters = Boolean(search || role);

	useEffect(() => {
		if (debouncedSearch === search) return;

		handleSearchChange(debouncedSearch);
	}, [debouncedSearch, handleSearchChange, search]);

	const handleClearSearch = () => {
		setSearchInput("");
		handleSearchChange("");
	};

	const handleResetFilters = () => {
		setSearchInput("");
		handleResetAll();
	};

	return (
		<div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end">
				<Field className="gap-1 sm:max-w-72">
					<InputGroup className="h-8 max-w-xs">
						<InputGroupInput
							id="members-search"
							value={searchInput}
							placeholder="Search members..."
							onChange={event => setSearchInput(event.target.value)}
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Search} data-icon="inline-start" />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<AiFillCloseCircle
								className={cn("cursor-pointer", !searchInput && "invisible")}
								onClick={handleClearSearch}
							/>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				<div className="flex flex-row items-center gap-2">
					<DataTableSingleSelectFacetedFilter
						title="Role"
						queryParameter="role"
						options={teamMemberRoleFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					{hasFilters ? (
						<Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
							Reset
							<HugeiconsIcon icon={Cancel01Icon} />
						</Button>
					) : null}
				</div>
			</div>
			<div className="flex flex-col gap-2 sm:items-end">
				<div className="flex flex-wrap items-center gap-2 sm:justify-end">
					<Button type="button" size="sm" onClick={handleRefresh} disabled={isFetching}>
						<HugeiconsIcon
							icon={RefreshIcon}
							data-icon="inline-start"
							className={isFetching ? "animate-spin" : undefined}
						/>
						Refresh
					</Button>
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</div>
	);
}

