import type { TeamRole } from "@/features/team-details/team-members/types/team-members.types";

export type TeamStatus = "ACTIVE" | "INACTIVE";

export const teamStatusValues = ["ACTIVE", "INACTIVE"] as const;
export const teamSortValues = ["name", "status", "memberCount", "createdAt", "updatedAt"] as const;
export const teamSortDirectionValues = ["asc", "desc"] as const;

export type TeamSort = (typeof teamSortValues)[number];
export type TeamSortDirection = (typeof teamSortDirectionValues)[number];

export interface TeamOwner {
	id: string;
	name: string | null;
	email: string;
}

export interface ManagedTeam {
	id: string;
	name: string;
	slug: string | null;
	status: TeamStatus;
	memberCount: number;
	owner: TeamOwner | null;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export type TeamListResponse = PaginatedData<ManagedTeam>;

export interface TeamListQuery {
	page: number;
	pageSize: number;
	search?: string;
	status?: string;
	fromDate?: string;
	toDate?: string;
	sort: TeamSort;
	dir: TeamSortDirection;
}

export interface CreateTeamInput {
	name: string;
}

export interface UpdateTeamInput {
	id: string;
	name?: string;
	status?: TeamStatus;
}

export interface ArchiveTeamInput {
	id: string;
}

export interface ArchiveTeamResponse {
	archived: boolean;
}

export interface SelectTeamInput {
	teamId: string;
}

export interface SelectTeamResponse {
	currentTeamId: string | null;
	currentTeamRole: TeamRole | null;
}
