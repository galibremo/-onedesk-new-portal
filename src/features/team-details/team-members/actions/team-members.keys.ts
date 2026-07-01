import type { TeamMemberListQuery } from "@/features/team-details/team-members/types/team-members.types";

export const teamMemberKeys = {
	all: ["team-members"] as const,
	lists: () => [...teamMemberKeys.all, "list"] as const,
	list: (query: TeamMemberListQuery) => [...teamMemberKeys.lists(), query] as const
};
