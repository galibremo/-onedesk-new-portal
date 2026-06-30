import { z } from "zod";

import { teamRoleValues, teamStatusValues } from "@/features/teams/types/teams.types";
import { validateEnum, validateString } from "@/validators/common-rule";

export const createTeamFormSchema = z.object({
	name: validateString("Team name", { min: 1, max: 255 })
});

export const editTeamFormSchema = z.object({
	name: validateString("Team name", { min: 1, max: 255 }),
	status: validateEnum("Status", teamStatusValues)
});

export const addMembersFormSchema = z.object({
	members: z
		.array(
			z.object({
				userId: z.string().min(1, "User is required"),
				role: validateEnum("Role", teamRoleValues)
			})
		)
		.min(1, "At least one member is required")
});

export type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>;
export type EditTeamFormValues = z.infer<typeof editTeamFormSchema>;
export type AddMembersFormValues = z.infer<typeof addMembersFormSchema>;
