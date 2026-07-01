import type { TeamRole, TeamMemberStatus } from "@/features/team-details/team-members/types/team-members.types";

export function formatTeamRole(role: TeamRole): string {
	return role === "TEAM_LEAD" ? "Team Lead" : "Agent";
}

export function formatTeamMemberStatus(status: TeamMemberStatus): string {
	return status === "ACTIVE" ? "Active" : status === "INVITED" ? "Invited" : "Inactive";
}
