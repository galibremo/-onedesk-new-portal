import type { TeamListQuery } from "@/features/teams/types/teams.types";

export const teamKeys = {
	all: ["teams"] as const,
	lists: () => [...teamKeys.all, "list"] as const,
	list: (filters?: TeamListQuery) => [...teamKeys.lists(), filters] as const,
	details: () => [...teamKeys.all, "detail"] as const,
	detail: (id: string) => [...teamKeys.details(), id] as const
};

