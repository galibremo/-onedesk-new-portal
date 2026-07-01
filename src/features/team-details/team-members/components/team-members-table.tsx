"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";

import { createTeamMemberColumns } from "@/features/team-details/team-members/components/team-members-data-columns";
import { TeamMembersDataTableToolbar } from "@/features/team-details/team-members/components/team-members-data-table-toolbar";
import { useTeamMembersList } from "@/features/team-details/team-members/hooks/use-team-members-list";

export function TeamMembersTable() {
	const { tableData, pagination, isLoading, handleOptionFilter, sort, dir, handleSorting } =
		useTeamMembersList();

	const columns = useMemo(
		() =>
			createTeamMemberColumns({
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
			DataTableToolbar={TeamMembersDataTableToolbar}
			emptyTitle="No members found"
			emptyDescription="Members matching your filters will appear here."
		/>
	);
}

