"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { TeamMemberTableRowActions } from "@/features/team-details/team-members/components/team-member-data-table-row-actions";
import type { TeamMember } from "@/features/team-details/team-members/types/team-members.types";
import { formatTeamRole, formatTeamMemberStatus } from "@/features/team-details/team-members/utils/team-members-format";

interface TeamMemberColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createTeamMemberColumns({
	sort,
	dir,
	handleSorting
}: TeamMemberColumnsOptions): ColumnDef<TeamMember>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Member"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => {
				const member = row.original;
				const initials = (member.name ?? member.email)
					.split(" ")
					.map(w => w[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				return (
					<div className="flex items-center gap-3">
						<Avatar className="size-8 shrink-0">
							{member.image ? <AvatarImage src={member.image} alt={member.name ?? ""} /> : null}
							<AvatarFallback className="text-xs">{initials}</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<div className="truncate text-sm font-medium">{member.name ?? member.email}</div>
							<div className="text-muted-foreground truncate text-xs">{member.email}</div>
						</div>
					</div>
				);
			}
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Role"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <span className="text-sm">{formatTeamRole(row.original.role)}</span>
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Status"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) =>
				row.original.status === "ACTIVE" ? (
					<Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
						{formatTeamMemberStatus(row.original.status)}
					</Badge>
				) : (
					<Badge variant="secondary">{formatTeamMemberStatus(row.original.status)}</Badge>
				)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <TeamMemberTableRowActions member={row.original} />
		}
	];
}
