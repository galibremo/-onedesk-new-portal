"use client";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamQuery } from "@/features/teams/actions/teams.queries";
import type { ManagedTeam } from "@/features/teams/types/teams.types";
import { formatTeamDate } from "@/features/teams/utils/team-format";

interface TeamDetailsDialogProps {
	team: ManagedTeam;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeamDetailsDialog({ team, open, onOpenChange }: TeamDetailsDialogProps) {
	const teamQuery = useTeamQuery(team.id, open);
	const data = teamQuery.data ?? team;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Team details</DialogTitle>
					<DialogDescription>{data.name}</DialogDescription>
				</DialogHeader>
				{teamQuery.isLoading ? (
					<div className="grid gap-4">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				) : (
					<div className="grid gap-4 text-sm">
						<div className="grid grid-cols-3 gap-2">
							<span className="text-muted-foreground">Name</span>
							<span className="col-span-2 font-medium">{data.name}</span>
						</div>
						{data.slug ? (
							<div className="grid grid-cols-3 gap-2">
								<span className="text-muted-foreground">Slug</span>
								<span className="text-muted-foreground col-span-2 font-mono text-xs">
									{data.slug}
								</span>
							</div>
						) : null}
						<div className="grid grid-cols-3 gap-2">
							<span className="text-muted-foreground">Owner</span>
							<div className="col-span-2">
								{data.owner ? (
									<>
										<div className="font-medium">{data.owner.name ?? data.owner.email}</div>
										<div className="text-muted-foreground text-xs">{data.owner.email}</div>
									</>
								) : (
									<span className="text-muted-foreground">—</span>
								)}
							</div>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<span className="text-muted-foreground">Status</span>
							<div className="col-span-2">
								{data.status === "ACTIVE" ? (
									<Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
										Active
									</Badge>
								) : (
									<Badge variant="secondary">Inactive</Badge>
								)}
							</div>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<span className="text-muted-foreground">Members</span>
							<span className="col-span-2">{data.memberCount}</span>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<span className="text-muted-foreground">Created</span>
							<span className="col-span-2">{formatTeamDate(data.createdAt)}</span>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<span className="text-muted-foreground">Updated</span>
							<span className="col-span-2">{formatTeamDate(data.updatedAt)}</span>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
