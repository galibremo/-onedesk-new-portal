"use client";

import { Archive02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useArchiveTeamMutation } from "@/features/teams/actions/teams.mutations";
import type { ManagedTeam } from "@/features/teams/types/teams.types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { handleRequestError } from "@/lib/api/handle-request-error";

interface TeamArchiveDialogProps {
	team: ManagedTeam;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeamArchiveDialog({ team, open, onOpenChange }: TeamArchiveDialogProps) {
	const router = useRouter();
	const archiveTeamMutation = useArchiveTeamMutation();

	const handleArchive = useCallback(() => {
		archiveTeamMutation.mutate(
			{ id: team.id },
			{
				onSuccess: () => {
					toast.success("Team archived");
					onOpenChange(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to archive team");
				}
			}
		);
	}, [archiveTeamMutation, router, team.id, onOpenChange]);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={Archive02Icon} />
					</AlertDialogMedia>
					<AlertDialogTitle>Archive team?</AlertDialogTitle>
					<AlertDialogDescription>
						This will archive <strong>{team.name}</strong>. The team will no longer be active but
						its data will be preserved.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={handleArchive}
						disabled={archiveTeamMutation.isPending}
					>
						{archiveTeamMutation.isPending ? "Archiving" : "Archive team"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
