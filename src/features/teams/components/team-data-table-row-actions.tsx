"use client";

import {
	Archive02Icon,
	EyeIcon,
	MoreVerticalIcon,
	UserEdit01Icon,
	UserMultiple02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TeamArchiveDialog } from "@/features/teams/components/team-archive-dialog";
import { TeamDetailsDialog } from "@/features/teams/components/team-details-dialog";
import { TeamEditDialog } from "@/features/teams/components/team-edit-dialog";
import { TeamMembersDialog } from "@/features/teams/components/team-members-dialog";
import type { ManagedTeam } from "@/features/teams/types/teams.types";

interface TeamDataTableRowActionsProps {
	team: ManagedTeam;
}

export function TeamDataTableRowActions({ team }: TeamDataTableRowActionsProps) {
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [archiveOpen, setArchiveOpen] = useState(false);
	const [membersOpen, setMembersOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Open actions for ${team.name}`}
					>
						<HugeiconsIcon icon={MoreVerticalIcon} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onSelect={event => {
							event.preventDefault();
							setDetailsOpen(true);
						}}
					>
						<HugeiconsIcon icon={EyeIcon} />
						View details
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={event => {
							event.preventDefault();
							setEditOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Edit team
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={event => {
							event.preventDefault();
							setMembersOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserMultiple02Icon} />
						Manage members
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onSelect={event => {
							event.preventDefault();
							setArchiveOpen(true);
						}}
					>
						<HugeiconsIcon icon={Archive02Icon} />
						Archive team
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<TeamDetailsDialog team={team} open={detailsOpen} onOpenChange={setDetailsOpen} />
			<TeamEditDialog team={team} open={editOpen} onOpenChange={setEditOpen} />
			<TeamMembersDialog team={team} open={membersOpen} onOpenChange={setMembersOpen} />
			<TeamArchiveDialog team={team} open={archiveOpen} onOpenChange={setArchiveOpen} />
		</>
	);
}
