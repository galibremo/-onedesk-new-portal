"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import {
	useArchiveTeamMutation,
	useUpdateTeamMutation
} from "@/features/teams/actions/teams.mutations";
import {
	editTeamFormSchema,
	type EditTeamFormValues
} from "@/features/teams/schemas/team-form.schema";
import type { ManagedTeam } from "@/features/teams/types/teams.types";
import { handleRequestError } from "@/lib/api/handle-request-error";

export type UseTeamActionsReturn = ReturnType<typeof useTeamActions>;

export function useTeamActions(team: ManagedTeam) {
	const router = useRouter();
	const updateTeamMutation = useUpdateTeamMutation();
	const archiveTeamMutation = useArchiveTeamMutation();

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
	const [membersDialogOpen, setMembersDialogOpen] = useState(false);

	const editForm = useForm<EditTeamFormValues>({
		resolver: zodResolver(editTeamFormSchema),
		defaultValues: { name: team.name, status: team.status }
	});

	const handleUpdateTeam = useCallback(
		(values: EditTeamFormValues) => {
			updateTeamMutation.mutate(
				{ id: team.id, name: values.name, status: values.status },
				{
					onSuccess: () => {
						toast.success("Team updated");
						setEditDialogOpen(false);
					},
					onError: error => {
						handleRequestError(error, router, "Failed to update team");
					}
				}
			);
		},
		[updateTeamMutation, router, team.id]
	);

	const handleArchiveTeam = useCallback(() => {
		archiveTeamMutation.mutate(
			{ id: team.id },
			{
				onSuccess: () => {
					toast.success("Team archived");
					setArchiveDialogOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to archive team");
				}
			}
		);
	}, [archiveTeamMutation, router, team.id]);

	const resetEditForm = useCallback(() => {
		editForm.reset({ name: team.name, status: team.status });
	}, [editForm, team.name, team.status]);

	return {
		editForm,
		updateTeamMutation,
		archiveTeamMutation,
		editDialogOpen,
		setEditDialogOpen,
		detailsDialogOpen,
		setDetailsDialogOpen,
		archiveDialogOpen,
		setArchiveDialogOpen,
		membersDialogOpen,
		setMembersDialogOpen,
		handleUpdateTeam,
		handleArchiveTeam,
		resetEditForm
	};
}
