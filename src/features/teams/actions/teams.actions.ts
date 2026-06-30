import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createTeamListQuery } from "@/features/teams/schemas/teams-api.schema";
import type {
	AddMembersInput,
	AddMembersResponse,
	ArchiveTeamInput,
	ArchiveTeamResponse,
	CreateTeamInput,
	ManagedTeam,
	RemoveMembersInput,
	RemoveMembersResponse,
	TeamListQuery,
	TeamListResponse,
	TeamMember,
	TeamMemberListQuery,
	TeamMemberListResponse,
	UpdateMemberRoleInput,
	UpdateTeamInput
} from "@/features/teams/types/teams.types";

export async function listTeams(filters: TeamListQuery): Promise<TeamListResponse> {
	return apiClient<TeamListResponse>({
		method: "GET",
		url: apiRoute.teams,
		params: createTeamListQuery(filters)
	});
}

export async function getTeam(id: string): Promise<ManagedTeam> {
	return apiClient<ManagedTeam>({
		method: "GET",
		url: apiRoute.team(id)
	});
}

export async function createTeam(data: CreateTeamInput): Promise<ManagedTeam> {
	return apiClient<ManagedTeam>({
		method: "POST",
		url: apiRoute.teams,
		data
	});
}

export async function updateTeam({ id, ...data }: UpdateTeamInput): Promise<ManagedTeam> {
	return apiClient<ManagedTeam>({
		method: "PATCH",
		url: apiRoute.team(id),
		data
	});
}

export async function archiveTeam({ id }: ArchiveTeamInput): Promise<ArchiveTeamResponse> {
	return apiClient<ArchiveTeamResponse>({
		method: "DELETE",
		url: apiRoute.team(id)
	});
}

export async function listTeamMembers(filters: TeamMemberListQuery): Promise<TeamMemberListResponse> {
	const { teamId, ...params } = filters;

	return apiClient<TeamMemberListResponse>({
		method: "GET",
		url: apiRoute.teamMembers(teamId),
		params
	});
}

export async function addTeamMembers({ teamId, members }: AddMembersInput): Promise<AddMembersResponse> {
	return apiClient<AddMembersResponse>({
		method: "POST",
		url: apiRoute.teamMembers(teamId),
		data: { members }
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
