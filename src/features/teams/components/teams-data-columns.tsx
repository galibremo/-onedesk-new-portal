"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { ManagedTeam } from "@/features/teams/types/teams.types";
import { formatTeamDate } from "@/features/teams/utils/team-format";

import { TeamDataTableRowActions } from "./team-data-table-row-actions";

interface TeamColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createTeamColumns({
	sort,
	dir,
	handleSorting
}: TeamColumnsOptions): ColumnDef<ManagedTeam>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Name"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
		},
		{
			accessorKey: "owner",
			header: "Owner",
			cell: ({ row }) => {
				const owner = row.original.owner;
				if (!owner) return <span className="text-muted-foreground text-sm">—</span>;
				return (
					<div className="min-w-0">
						<div className="truncate text-sm font-medium">{owner.name ?? owner.email}</div>
						<div className="text-muted-foreground truncate text-xs">{owner.email}</div>
					</div>
				);
			}
		},
		{
			accessorKey: "memberCount",
			header: "Members",
			cell: ({ row }) => (
				<Badge variant="secondary">{row.original.memberCount}</Badge>
			)
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
						Active
					</Badge>
				) : (
					<Badge variant="secondary">Inactive</Badge>
				)
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Created"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatTeamDate(row.original.createdAt)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <TeamDataTableRowActions team={row.original} />
		}
	];
}
