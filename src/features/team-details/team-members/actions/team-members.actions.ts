import { apiClient } from "@/lib/api/client";

import type {
	AddMembersInput,
	AddMembersResponse,
	RemoveMembersInput,
	RemoveMembersResponse,
	TeamMember,
	TeamMemberListQuery,
	TeamMemberListResponse,
	UpdateMemberRoleInput
} from "@/features/team-details/team-members/types/team-members.types";
import { apiRoute } from "@/routes/routes";

export async function listTeamMembers(
	filters: TeamMemberListQuery
): Promise<TeamMemberListResponse> {
	const { teamId, ...params } = filters;

	return apiClient<TeamMemberListResponse>({
		method: "GET",
		url: apiRoute.teamMembers(teamId),
		params
	});
}

export async function addTeamMembers({
	teamId,
	members
}: AddMembersInput): Promise<AddMembersResponse> {
	return apiClient<AddMembersResponse>({
		method: "POST",
		url: apiRoute.teamMembers(teamId),
		data: { teamId, members }
	});
}

export async function removeTeamMembers({
	teamId,
	memberIds
}: RemoveMembersInput): Promise<RemoveMembersResponse> {
	return apiClient<RemoveMembersResponse>({
		method: "DELETE",
		url: apiRoute.teamMembersRemove(teamId),
		data: { memberIds }
	});
}

export async function updateMemberRole({
	teamId,
	userId,
	role
}: UpdateMemberRoleInput): Promise<TeamMember> {
	return apiClient<TeamMember>({
		method: "PATCH",
		url: apiRoute.teamMemberRole(teamId, userId),
		data: { role }
	});
}

