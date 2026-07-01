"use client";

import { UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { handleRequestError } from "@/lib/api/handle-request-error";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { AddTeamMemberDialog } from "@/features/team-details/team-members/components/add-team-member-dialog";
import { TeamMembersTable } from "@/features/team-details/team-members/components/team-members-table";
import {
	TeamMembersListProvider,
	useTeamMembersList
} from "@/features/team-details/team-members/hooks/use-team-members-list";

interface TeamMembersPageProps {
	teamId: string;
}

export function TeamMembersPage({ teamId }: TeamMembersPageProps) {
	return (
		<TeamMembersListProvider teamId={teamId}>
			<TeamMembersPageContent teamId={teamId} />
		</TeamMembersListProvider>
	);
}

function TeamMembersPageContent({ teamId }: TeamMembersPageProps) {
	const router = useRouter();
	const { tableData, error } = useTeamMembersList();
	const [addMemberOpen, setAddMemberOpen] = useState(false);

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load members");
	}, [error, router]);

	return (
		<>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={UserMultiple02Icon} className="text-primary size-6" />
							Team Members
						</h1>
						<p className="text-muted-foreground text-sm">Manage team members and assign roles.</p>
					</div>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Members Directory</CardTitle>
						<CardDescription>Search, filter, and manage team members.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<TeamMembersTable onAddMember={() => setAddMemberOpen(true)} />
					</CardContent>
				</Card>
			</div>

			<AddTeamMemberDialog
				teamId={teamId}
				existingMemberIds={tableData.map(m => m.userId)}
				open={addMemberOpen}
				onOpenChange={setAddMemberOpen}
			/>
		</>
	);
}

