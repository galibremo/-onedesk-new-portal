"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useTeamMembersQuery } from "@/features/team-details/team-members/actions/team-members.queries";
import { teamMembersSearchParams } from "@/features/team-details/team-members/schemas/team-members.schema";
import type {
	TeamMember,
	TeamMemberListQuery,
	TeamMemberListResponse,
	TeamMemberSort,
	TeamMemberSortDirection
} from "@/features/team-details/team-members/types/team-members.types";
import { teamMemberSortValues } from "@/features/team-details/team-members/types/team-members.types";

type TeamMemberPagination = PaginatedData<TeamMember>;

interface TeamMembersListContextValue {
	tableData: TeamMember[];
	pagination: TeamMemberPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	role: string;
	sort: TeamMemberSort;
	dir: TeamMemberSortDirection;
	handleSorting: (sort: string, dir: TeamMemberSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleRoleChange: (value: string) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: TeamMemberListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableColumns = new Set<string>(teamMemberSortValues);
const TeamMembersListContext = createContext<TeamMembersListContextValue | null>(null);

interface TeamMembersListProviderProps extends GlobalLayoutProps {
	teamId: string;
}

export function TeamMembersListProvider({ teamId, children }: TeamMembersListProviderProps) {
	const [params, setParams] = useQueryStates(teamMembersSearchParams);
	const filters = useMemo<TeamMemberListQuery>(
		() => ({
			teamId,
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			role: params.role || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[teamId, params.dir, params.page, params.pageSize, params.search, params.sort, params.role]
	);

	const membersQuery = useTeamMembersQuery(filters);
	const pagination = membersQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: TeamMemberSortDirection) => {
			if (!sortableColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as TeamMemberSort, dir: nextDir, page: 1 });
		},
		[setParams]
	);

	const handleOptionFilter = useCallback(
		(key: string, value?: string | string[] | null) => {
			const normalizedValue = Array.isArray(value) ? value.join(",") : value;

			if (key === "page") {
				void setParams({ page: Number(normalizedValue) || 1 });
				return;
			}

			if (key === "limit" || key === "pageSize") {
				void setParams({
					pageSize: Number(normalizedValue) || defaultPagination.pageSize,
					page: defaultPagination.page
				});
			}
		},
		[setParams]
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			void setParams({ search: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const handleRoleChange = useCallback(
		(value: string) => {
			void setParams({ role: value || null, page: 1 });
		},
		[setParams]
	);

	const handleResetAll = useCallback(() => {
		void setParams({
			page: 1,
			pageSize: 10,
			search: null,
			role: null,
			sort: "name",
			dir: "asc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(membersQuery.refetch(), {
			loading: "Refreshing members...",
			success: "Members refreshed",
			error: "Failed to refresh members"
		});
	}, [membersQuery]);

	const value = useMemo<TeamMembersListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: membersQuery.isLoading,
			isFetching: membersQuery.isFetching,
			error: membersQuery.error,
			search: params.search,
			role: params.role,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleRoleChange,
			handleResetAll,
			handleRefresh
		}),
		[
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleRoleChange,
			handleSearchChange,
			handleSorting,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.dir,
			params.role,
			params.search,
			params.sort,
			membersQuery.error,
			membersQuery.isFetching,
			membersQuery.isLoading
		]
	);

	return (
		<TeamMembersListContext.Provider value={value}>{children}</TeamMembersListContext.Provider>
	);
}

export function useTeamMembersList() {
	const context = useContext(TeamMembersListContext);

	if (!context) {
		throw new Error("useTeamMembersList must be used within TeamMembersListProvider");
	}

	return context;
}
