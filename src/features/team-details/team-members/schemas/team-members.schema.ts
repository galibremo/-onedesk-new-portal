import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import { teamMemberSortDirectionValues, teamMemberSortValues } from "@/features/team-details/team-members/types/team-members.types";

export const teamMembersSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	role: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...teamMemberSortValues]).withDefault("name"),
	dir: parseAsStringEnum([...teamMemberSortDirectionValues]).withDefault("asc")
};
