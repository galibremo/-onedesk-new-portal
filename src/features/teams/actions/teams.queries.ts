import { useQuery } from "@tanstack/react-query";

import { getTeam, listTeams } from "./teams.actions";
import { teamKeys } from "./teams.keys";
import type { TeamListQuery } from "@/features/teams/types/teams.types";

export function useTeamsQuery(filters?: TeamListQuery) {
	return useQuery({
		queryKey: teamKeys.list(filters),
		queryFn: () => listTeams(filters)
	});
}

export function useTeamQuery(id: string, enabled = true) {
	return useQuery({
		queryKey: teamKeys.detail(id),
		queryFn: () => getTeam(id),
		enabled: Boolean(id) && enabled,
		refetchOnMount: "always"
	});
}
