"use client";

import { useEffect, useRef } from "react";

import { useDeselectTeamMutation } from "@/features/teams/actions/teams.mutations";
import useAuth from "@/hooks/use-auth";
import { usePathname } from "@/i18n/navigation";

export function TeamDeselectProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { user } = useAuth();
	const { mutateAsync: deselectTeamAsync } = useDeselectTeamMutation();
	const hasDeselected = useRef(false);

	useEffect(() => {
		if (hasDeselected.current) return;
		if (!user?.currentTeamId) return;

		const segments = pathname.split("/").filter(Boolean);
		const teamsIndex = segments.indexOf("teams");

		const hasTeamId =
			teamsIndex !== -1 &&
			teamsIndex + 1 < segments.length &&
			segments[teamsIndex + 1] !== "";

		if (!hasTeamId) {
			hasDeselected.current = true;
			deselectTeamAsync();
		}
	}, [pathname, deselectTeamAsync, user?.currentTeamId]);

	return <>{children}</>;
}
