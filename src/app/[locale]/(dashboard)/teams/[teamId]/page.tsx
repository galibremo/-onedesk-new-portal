import type { Metadata } from "next";

import TeamDetailsPage from "@/features/teams/components/team-details-page";

export const metadata: Metadata = {
	title: "Team Details",
	description: "View and manage team details and members."
};

export default async function TeamDetails({ params }: { params: Promise<{ teamId: string }> }) {
	const { teamId } = await params;
	return <TeamDetailsPage teamId={teamId} />;
}

