export type TeamRole = "TEAM_LEAD" | "AGENT";
export type TeamMemberStatus = "ACTIVE" | "INACTIVE" | "INVITED";

export const teamRoleValues = ["TEAM_LEAD", "AGENT"] as const;
export const teamMemberStatusValues = ["ACTIVE", "INACTIVE", "INVITED"] as const;
export const teamMemberSortValues = ["name", "role", "status", "email"] as const;
export const teamMemberSortDirectionValues = ["asc", "desc"] as const;

export type TeamMemberSort = (typeof teamMemberSortValues)[number];
export type TeamMemberSortDirection = (typeof teamMemberSortDirectionValues)[number];

export interface TeamMember {
	userId: string;
	name: string | null;
	email: string;
	image: string | null;
	role: TeamRole;
	status: TeamMemberStatus;
}

export type TeamMemberListResponse = PaginatedData<TeamMember>;

export interface TeamMemberListQuery {
	teamId: string;
	page: number;
	pageSize: number;
	search?: string;
	role?: string;
}

export interface AddMembersInput {
	teamId: string;
	members: Array<{ email: string; role: TeamRole }>;
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

