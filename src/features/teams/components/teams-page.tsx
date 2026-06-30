"use client";

import { UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { handleRequestError } from "@/lib/api/handle-request-error";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTeamDialog } from "@/features/teams/components/create-team-dialog";
import { TeamErrorAlert } from "@/features/teams/components/team-error-alert";
import { TeamsTable } from "@/features/teams/components/teams-table";
import { TeamListProvider, useTeamList } from "@/features/teams/hooks/use-team-list";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Teams", isCurrent: true }
];

export function TeamsPage() {
	return (
		<TeamListProvider>
			<TeamsPageContent />
		</TeamListProvider>
	);
}

function TeamsPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useTeamList();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load teams");
	}, [error, router]);

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={UserMultiple02Icon} className="text-primary size-6" />
							Teams
						</h1>
						<p className="text-muted-foreground text-sm">
							Create and manage teams, assign members, and configure roles.
						</p>
					</div>
					<CreateTeamDialog />
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Team Directory</CardTitle>
						<CardDescription>Search, filter, and manage your teams.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <TeamErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<TeamsTable />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

