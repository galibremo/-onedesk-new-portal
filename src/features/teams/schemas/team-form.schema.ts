import { z } from "zod";

import { teamStatusValues } from "@/features/teams/types/teams.types";
import { validateEnum, validateString } from "@/validators/common-rule";

export const createTeamFormSchema = z.object({
	name: validateString("Team name", { min: 1, max: 255 })
});

export const editTeamFormSchema = z.object({
	name: validateString("Team name", { min: 1, max: 255 }),
	status: validateEnum("Status", teamStatusValues)
});

export type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>;
export type EditTeamFormValues = z.infer<typeof editTeamFormSchema>;
