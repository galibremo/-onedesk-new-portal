import { z } from "zod";

import { teamRoleValues } from "@/features/team-details/team-members/types/team-members.types";
import { validateEnum } from "@/validators/common-rule";

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

export type AddMembersFormValues = z.infer<typeof addMembersFormSchema>;
