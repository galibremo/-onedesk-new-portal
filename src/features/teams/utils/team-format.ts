import { format } from "date-fns";

import type { TeamStatus } from "@/features/teams/types/teams.types";

export function formatTeamDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function formatTeamStatus(status: TeamStatus): string {
	return status === "ACTIVE" ? "Active" : "Inactive";
}
