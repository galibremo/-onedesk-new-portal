import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	addTeamMembers,
	removeTeamMembers,
	updateMemberRole
} from "./team-members.actions";
import { teamMemberKeys } from "./team-members.keys";

export function useAddTeamMembersMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addTeamMembers,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamMemberKeys.all });
		}
	});
}

export function useRemoveTeamMembersMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeTeamMembers,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamMemberKeys.all });
		}
	});
}

export function useUpdateMemberRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateMemberRole,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: teamMemberKeys.all });
		}
	});
}
