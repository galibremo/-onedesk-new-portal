export type TeamRole = "TEAM_LEAD" | "AGENT";
export type TeamMemberStatus = "ACTIVE" | "INACTIVE" | "INVITED";
export type TeamStatus = "ACTIVE" | "INACTIVE";

export const teamRoleValues = ["TEAM_LEAD", "AGENT"] as const;
export const teamStatusValues = ["ACTIVE", "INACTIVE"] as const;
export const teamMemberStatusValues = ["ACTIVE", "INACTIVE", "INVITED"] as const;
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

export interface TeamMember {
	userId: string;
	name: string | null;
	email: string;
	image: string | null;
	role: TeamRole;
	status: TeamMemberStatus;
}

export type TeamListResponse = PaginatedData<ManagedTeam>;
export type TeamMemberListResponse = PaginatedData<TeamMember>;

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

export interface TeamMemberListQuery {
	teamId: string;
	page: number;
	pageSize: number;
	search?: string;
	role?: string;
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

export interface AddMembersInput {
	teamId: string;
	members: Array<{ userId: string; role: TeamRole }>;
}

export interface RemoveMembersInput {
	teamId: string;
	memberIds: string[];
}

export interface UpdateMemberRoleInput {
	teamId: string;
	userId: string;
	role: TeamRole;
}

export interface AddMembersResponse {
	added: number;
}

export interface RemoveMembersResponse {
	removed: number;
}
