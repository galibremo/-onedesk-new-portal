"use client";

import { Cancel01Icon, RefreshIcon, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import { DataTableDateRangeFilter } from "@/components/common/table/data-table-date-range-filter";
import { DataTableSingleSelectFacetedFilter } from "@/components/common/table/data-table-single-select-faceted-filter";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useTeamList } from "@/features/teams/hooks/use-team-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

interface TeamsDataTableToolbarProps<TData> {
	table: Table<TData>;
}

const teamStatusFilterOptions = [
	{ label: "Active", value: "ACTIVE" },
	{ label: "Inactive", value: "INACTIVE" }
];

export function TeamsDataTableToolbar<TData>({ table }: TeamsDataTableToolbarProps<TData>) {
	const {
		search,
		status,
		fromDate,
		toDate,
		isFetching,
		handleSearchChange,
		handleStatusChange,
		handleDateRangeChange,
		handleOptionFilter,
		handleResetAll,
		handleRefresh
	} = useTeamList();
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const hasFilters = Boolean(search || status || fromDate || toDate);

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
							id="teams-search"
							value={searchInput}
							placeholder="Search teams..."
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
						title="Status"
						queryParameter="status"
						options={teamStatusFilterOptions}
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
					<DataTableDateRangeFilter
						id="teams-date-range"
						fromDate={fromDate}
						toDate={toDate}
						onChange={handleDateRangeChange}
					/>
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</div>
	);
}
