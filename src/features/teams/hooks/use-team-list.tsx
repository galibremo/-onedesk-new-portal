"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useTeamsQuery } from "@/features/teams/actions/teams.queries";
import { teamSearchParams } from "@/features/teams/schemas/teams.schema";
import type {
	ManagedTeam,
	TeamListQuery,
	TeamListResponse,
	TeamSort,
	TeamSortDirection
} from "@/features/teams/types/teams.types";
import { teamSortValues } from "@/features/teams/types/teams.types";

type TeamPagination = PaginatedData<ManagedTeam>;

interface TeamListContextValue {
	tableData: ManagedTeam[];
	pagination: TeamPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	status: string;
	fromDate: string;
	toDate: string;
	sort: TeamSort;
	dir: TeamSortDirection;
	handleSorting: (sort: string, dir: TeamSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleStatusChange: (value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: TeamListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableTeamColumns = new Set<string>(teamSortValues);
const TeamListContext = createContext<TeamListContextValue | null>(null);

interface TeamListProviderProps extends GlobalLayoutProps {}

export function TeamListProvider({ children }: TeamListProviderProps) {
	const [params, setParams] = useQueryStates(teamSearchParams);
	const filters = useMemo<TeamListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			status: params.status || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.dir,
			params.fromDate,
			params.page,
			params.pageSize,
			params.search,
			params.sort,
			params.status,
			params.toDate
		]
	);

	const teamsQuery = useTeamsQuery(filters);
	const pagination = teamsQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: TeamSortDirection) => {
			if (!sortableTeamColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as TeamSort, dir: nextDir, page: 1 });
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

	const handleStatusChange = useCallback(
		(value: string) => {
			void setParams({ status: value || null, page: 1 });
		},
		[setParams]
	);

	const handleDateRangeChange = useCallback(
		(value: { fromDate?: string; toDate?: string }) => {
			void setParams({
				fromDate: value.fromDate?.trim() || null,
				toDate: value.toDate?.trim() || null,
				page: 1
			});
		},
		[setParams]
	);

	const handleResetAll = useCallback(() => {
		void setParams({
			page: 1,
			pageSize: 10,
			search: null,
			status: null,
			fromDate: null,
			toDate: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(teamsQuery.refetch(), {
			loading: "Refreshing teams...",
			success: "Teams refreshed",
			error: "Failed to refresh teams"
		});
	}, [teamsQuery]);

	const value = useMemo<TeamListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: teamsQuery.isLoading,
			isFetching: teamsQuery.isFetching,
			error: teamsQuery.error,
			search: params.search,
			status: params.status,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleStatusChange,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			handleDateRangeChange,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSearchChange,
			handleSorting,
			handleStatusChange,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.dir,
			params.fromDate,
			params.search,
			params.sort,
			params.status,
			params.toDate,
			teamsQuery.error,
			teamsQuery.isFetching,
			teamsQuery.isLoading
		]
	);

	return <TeamListContext.Provider value={value}>{children}</TeamListContext.Provider>;
}

export function useTeamList() {
	const context = useContext(TeamListContext);

	if (!context) {
		throw new Error("useTeamList must be used within TeamListProvider");
	}

	return context;
}
