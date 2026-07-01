"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import { useTeamMembersList } from "@/features/team-details/team-members/hooks/use-team-members-list";
import { createTeamMemberColumns } from "@/features/team-details/team-members/components/team-members-data-columns";
import { TeamMembersDataTableToolbar } from "@/features/team-details/team-members/components/team-members-data-table-toolbar";

interface TeamMembersTableProps {
	onAddMember: () => void;
}

export function TeamMembersTable({ onAddMember }: TeamMembersTableProps) {
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

	const ToolbarComponent = (props: any) => (
		<TeamMembersDataTableToolbar {...props} onAddMember={onAddMember} />
	);

	return (
		<DataTable
			columns={columns}
			isLoading={isLoading}
			data={tableData}
			pagination={pagination}
			handleOptionFilter={handleOptionFilter}
			DataTableToolbar={ToolbarComponent}
			emptyTitle="No members found"
			emptyDescription="Members matching your filters will appear here."
		/>
	);
}
