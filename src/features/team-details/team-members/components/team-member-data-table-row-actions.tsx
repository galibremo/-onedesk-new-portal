"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import { handleRequestError } from "@/lib/api/handle-request-error";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

import {
	useRemoveTeamMembersMutation,
	useUpdateMemberRoleMutation
} from "@/features/team-details/team-members/actions/team-members.mutations";
import type {
	TeamMember,
	TeamRole
} from "@/features/team-details/team-members/types/team-members.types";
import { formatTeamRole } from "@/features/team-details/team-members/utils/team-members-format";

interface TeamMemberTableRowActionsProps {
	member: TeamMember;
}

export function TeamMemberTableRowActions({ member }: TeamMemberTableRowActionsProps) {
	const router = useRouter();
	const params = useParams();
	const teamId = params.teamId as string;
	const updateRoleMutation = useUpdateMemberRoleMutation();
	const removeMemberMutation = useRemoveTeamMembersMutation();

	const handleRoleChange = useCallback(
		(role: TeamRole) => {
			updateRoleMutation.mutate(
				{ teamId, userId: member.userId, role },
				{
					onSuccess: () => toast.success("Role updated"),
					onError: error => handleRequestError(error, router, "Failed to update role")
				}
			);
		},
		[updateRoleMutation, router, teamId, member.userId]
	);

	const handleRemove = useCallback(() => {
		removeMemberMutation.mutate(
			{ teamId, memberIds: [member.userId] },
			{
				onSuccess: () => toast.success("Member removed"),
				onError: error => handleRequestError(error, router, "Failed to remove member")
			}
		);
	}, [removeMemberMutation, router, teamId, member.userId]);

	return (
		<div className="flex items-center gap-2">
			<Select
				value={member.role}
				onValueChange={value => handleRoleChange(value as TeamRole)}
				disabled={updateRoleMutation.isPending}
			>
				<SelectTrigger className="h-7 w-28 text-xs">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="TEAM_LEAD">{formatTeamRole("TEAM_LEAD")}</SelectItem>
					<SelectItem value="AGENT">{formatTeamRole("AGENT")}</SelectItem>
				</SelectContent>
			</Select>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button type="button" size="icon" variant="ghost" className="size-7 shrink-0">
						<HugeiconsIcon icon={Cancel01Icon} className="size-4" />
						<span className="sr-only">Remove</span>
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your account from our
							servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleRemove()}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

