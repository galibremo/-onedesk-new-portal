import {
	Audit01Icon,
	ComputerProtectionIcon,
	DashboardSquare01Icon,
	Mail01Icon,
	MailSettingIcon,
	MessageMultiple02Icon,
	Settings02Icon,
	UserGroupIcon,
	UserIcon,
	UserMultiple02Icon
} from "@hugeicons/core-free-icons";

import type { NavItemProps, NavUserMaxItemProps } from "@/components/layout/layout.types";

import { route } from "@/routes/routes";

//main dashboard navigation items

const userItems: NavUserMaxItemProps = [
	{
		title: "Profile",
		url: route.private.profile,
		icon: UserIcon
	},
	{
		title: "Sessions",
		url: route.private.sessions,
		icon: ComputerProtectionIcon
	}
];

const navPlatformItem: NavItemProps[] = [
	{
		title: "Dashboard",
		url: route.private.dashboard,
		icon: DashboardSquare01Icon
		// items: [{ title: "Profile", url: route.private.profile }],
	},
	{
		title: "Users",
		url: route.private.users,
		icon: UserGroupIcon,
		roles: ["ADMIN", "SUPER_ADMIN"]
	},
	{
		title: "Teams",
		url: route.private.teams,
		icon: UserMultiple02Icon
	}
];

const navSystemItem: NavItemProps[] = [
	{
		title: "System Settings",
		url: route.private.system,
		icon: Settings02Icon,
		roles: ["ADMIN", "SUPER_ADMIN"]
	}
];

const navLogsItem: NavItemProps[] = [
	{
		title: "Email Logs",
		url: route.private.emailLogs,
		icon: Mail01Icon,
		roles: ["ADMIN", "SUPER_ADMIN"]
	},
	{
		title: "Audit Logs",
		url: route.private.auditLogs,
		icon: Audit01Icon,
		roles: ["ADMIN", "SUPER_ADMIN"]
	}
];

const navSMTPItem: NavItemProps[] = [
	{
		title: "SMTP Providers",
		url: route.private.smtpProviders,
		icon: Mail01Icon,
		roles: ["ADMIN", "SUPER_ADMIN"]
	},
	{
		title: "Email Templates",
		url: route.private.emailTemplates,
		icon: MailSettingIcon,
		roles: ["ADMIN", "SUPER_ADMIN"]
	}
];

const navIntegrationsItem: NavItemProps[] = [
	{
		title: "Channels",
		url: route.private.channels,
		icon: MessageMultiple02Icon
	}
];

//team dashboard navigation items

const getNavPlatformTeamsItem: (publicId: string) => NavItemProps[] = publicId => [
	{
		title: "Dashboard",
		url: route.private.teamDetails(publicId),
		icon: DashboardSquare01Icon
	},
	{
		title: "Team Members",
		url: route.private.teamMembers(publicId),
		icon: UserMultiple02Icon
	}
];

export {
	navIntegrationsItem,
	navLogsItem,
	navPlatformItem,
	navSMTPItem,
	navSystemItem,
	userItems,
	getNavPlatformTeamsItem
};

