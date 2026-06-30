import { ApiError } from "@/lib/api/errors";

export function getTeamErrorMessage(error: unknown): string {
	if (!(error instanceof ApiError)) {
		return "Team request failed. Please try again.";
	}

	switch (error.code) {
		case "team_not_found":
			return "That team was not found.";
		case "team_name_exists":
			return "A team with this name already exists.";
		case "team_already_archived":
			return "This team is already archived.";
		case "members_already_exist":
			return "All provided users are already team members.";
		case "forbidden":
			return "You do not have permission to manage this team.";
		case "unauthorized":
			return "Please sign in again to manage teams.";
		default:
			return error.message || "Team request failed. Please try again.";
	}
}
