import { useQuery } from "@tanstack/react-query";

import { listTeamMembers } from "./team-members.actions";
import { teamMemberKeys } from "./team-members.keys";
import type { TeamMemberListQuery } from "@/features/team-details/team-members/types/team-members.types";

export function useTeamMembersQuery(query: TeamMemberListQuery, enabled = true) {
	return useQuery({
		queryKey: teamMemberKeys.list(query),
		queryFn: () => listTeamMembers(query),
		enabled: Boolean(query.teamId) && enabled
	});
}
