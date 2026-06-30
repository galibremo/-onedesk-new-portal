import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

import TeamDetailsPage from "@/features/teams/components/team-details-page";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

async function fetchTeamForMeta(teamId: string) {
	const cookieStore = await cookies();
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`, {
		headers: { Cookie: cookieStore.toString() },
		cache: "no-store"
	});
	if (!res.ok) return null;
	const json = await res.json();
	return json.data as { name: string } | null;
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ teamId: string }>;
}): Promise<Metadata> {
	const { teamId } = await params;
	const team = await fetchTeamForMeta(teamId);
	return {
		title: team ? `${team.name} | Team` : "Team Details",
		description: "View and manage team details and members."
	};
}

export default async function TeamDetails({ params }: { params: Promise<{ teamId: string }> }) {
	const { teamId } = await params;
	const team = await fetchTeamForMeta(teamId);

	const breadcrumbItems = [
		{ name: "Dashboard", href: route.private.dashboard },
		{ name: "Teams", href: route.private.teams },
		{ name: team?.name || "Team Details", isCurrent: true }
	];

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SetBreadcrumb items={breadcrumbItems} />
			<TeamDetailsPage />
		</Suspense>
	);
}

