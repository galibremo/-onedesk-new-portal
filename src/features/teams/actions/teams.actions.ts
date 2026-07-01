import { apiClient } from "@/lib/api/client";

import { createTeamListQuery } from "@/features/teams/schemas/teams-api.schema";
import type {
	ArchiveTeamInput,
	ArchiveTeamResponse,
	CreateTeamInput,
	ManagedTeam,
	TeamListQuery,
	TeamListResponse,
	UpdateTeamInput
} from "@/features/teams/types/teams.types";
import { apiRoute } from "@/routes/routes";

export async function listTeams(filters?: TeamListQuery): Promise<TeamListResponse> {
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

