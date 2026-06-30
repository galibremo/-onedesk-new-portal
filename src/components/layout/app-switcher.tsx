"use client";

import * as React from "react";
import { FaCheck, FaLayerGroup } from "react-icons/fa";
import { HiChevronUpDown } from "react-icons/hi2";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { useSelectTeamMutation } from "@/features/teams/actions/teams.mutations";
import { useTeamsQuery } from "@/features/teams/actions/teams.queries";
import { useRouter } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export function AppSwitcher() {
	const router = useRouter();
	const { data: teamList } = useTeamsQuery();
	const { mutateAsync: selectTeamAsync } = useSelectTeamMutation();
	const teams = teamList?.rows ?? [];

	const [selectedTeamId, setSelectedTeamId] = React.useState<string | undefined>(undefined);

	const selectedTeam = teams.find(team => team.id === selectedTeamId);

	const handleSelectTeam = async (teamId: string) => {
		setSelectedTeamId(teamId);
		await selectTeamAsync({ teamId });
		router.push(route.private.team(teamId));
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<FaLayerGroup className="size-4" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-medium">Dashboard</span>
								<span className="">{selectedTeam?.name ?? "Select a team"}</span>
							</div>
							<HiChevronUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
						{teams.map(team => (
							<DropdownMenuItem key={team.id} onSelect={() => handleSelectTeam(team.id)}>
								{team.name} {team.id === selectedTeamId && <FaCheck className="ml-auto" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

