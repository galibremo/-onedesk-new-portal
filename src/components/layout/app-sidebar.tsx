"use client";

import { useParams, usePathname } from "next/dist/client/components/navigation";
import * as React from "react";

import { AppSwitcher } from "@/components/layout/app-switcher";
import {
	getNavPlatformTeamsItem,
	navIntegrationsItem,
	navLogsItem,
	navPlatformItem,
	navSMTPItem,
	navSystemItem,
	userItems
} from "@/components/layout/menu";
import { NavMenu } from "@/components/layout/nav-menu";
import { NavUser } from "@/components/layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { teamId } = useParams();
	const pathname = usePathname();
	const currentTeam = String(teamId);
	const isTeamRoute = pathname.includes("/teams/") && currentTeam;

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<AppSwitcher />
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{isTeamRoute ? (
					<>
						<NavMenu label="Platform" items={getNavPlatformTeamsItem(currentTeam)} />
						<NavMenu label="Integrations" items={navIntegrationsItem} />
					</>
				) : (
					<>
						<NavMenu label="Platform" items={navPlatformItem} />
						<NavMenu label="SMTP" items={navSMTPItem} />
						<NavMenu label="Logs" items={navLogsItem} />
						<NavMenu label="System" items={navSystemItem} />
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser items={userItems} />
			</SidebarFooter>
		</Sidebar>
	);
}

