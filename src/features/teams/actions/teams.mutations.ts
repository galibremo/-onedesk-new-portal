import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	addTeamMembers,
	archiveTeam,
	createTeam,
	removeTeamMembers,
	updateMemberRole,
	updateTeam
} from "./teams.actions";
import { teamKeys } from "./teams.keys";

export function useCreateTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTeam,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamKeys.all });
		}
	});
}

export function useUpdateTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTeam,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamKeys.all });
		}
	});
}

export function useArchiveTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: archiveTeam,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamKeys.all });
		}
	});
}

export function useAddTeamMembersMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addTeamMembers,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamKeys.all });
		}
	});
}

export function useRemoveTeamMembersMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeTeamMembers,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamKeys.all });
		}
	});
}

export function useUpdateMemberRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateMemberRole,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamKeys.all });
		}
	});
}
