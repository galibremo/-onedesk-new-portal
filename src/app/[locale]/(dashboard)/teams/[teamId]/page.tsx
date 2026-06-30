import type { Metadata } from "next";

import TeamDetailsPage from "@/features/teams/components/team-details-page";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

export const metadata: Metadata = {
	title: "Team Details",
	description: "View and manage team details and members."
};

export default async function TeamDetails({ params }: { params: Promise<{ teamId: string }> }) {
	const { teamId } = await params;

	const breadcrumbItems = [
		{ name: "Dashboard", href: route.private.dashboard },
		{ name: "Teams", href: route.private.teams },
		{ name: "Team Details", isCurrent: true }
	];

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<TeamDetailsPage />
		</>
	);
}

