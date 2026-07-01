import type { Metadata } from "next";

import { TeamsPage } from "@/features/teams/components/teams-page";

export const metadata: Metadata = {
	title: "Teams",
	description: "Manage teams and their members."
};

export default function Teams() {
	return <TeamsPage />;
}

