"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import { useTeamList } from "@/features/teams/hooks/use-team-list";

import { createTeamColumns } from "./teams-data-columns";
import { TeamsDataTableToolbar } from "./teams-data-table-toolbar";

export function TeamsTable() {
	const { tableData, pagination, isLoading, handleOptionFilter, sort, dir, handleSorting } =
		useTeamList();

	const columns = useMemo(
		() =>
			createTeamColumns({
				sort: sort as string,
				dir,
				handleSorting
			}),
		[sort, dir, handleSorting]
	);

	return (
		<DataTable
			columns={columns}
			isLoading={isLoading}
			data={tableData}
			pagination={pagination}
			handleOptionFilter={handleOptionFilter}
			DataTableToolbar={TeamsDataTableToolbar}
			emptyTitle="No teams found"
			emptyDescription="Teams matching your filters will appear here."
		/>
	);
}
