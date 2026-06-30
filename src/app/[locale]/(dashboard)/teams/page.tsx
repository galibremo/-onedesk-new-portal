import { TeamsPage } from "@/features/teams/components/teams-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Teams",
	description: "Manage teams and their members."
};

export default function Teams() {
	return <TeamsPage />;
}
