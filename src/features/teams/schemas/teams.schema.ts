import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import { teamSortDirectionValues, teamSortValues } from "@/features/teams/types/teams.types";

export const teamSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	status: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...teamSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...teamSortDirectionValues]).withDefault("desc")
};
