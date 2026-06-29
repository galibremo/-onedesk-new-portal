'use client';

import { useQueryStates } from 'nuqs';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { toast } from 'sonner';

import { useChannelsQuery } from '@/features/channels/actions/channels.queries';
import {
	channelsSearchParams,
	type ChannelSort,
	type ChannelSortDirection,
} from '@/features/channels/schemas/channels.schema';
import type { Channel, ChannelsListResponse } from '@/features/channels/types/channels.types';

interface ChannelsListContextValue {
	tableData: Channel[];
	pagination: ChannelsListResponse;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	sort: ChannelSort;
	dir: ChannelSortDirection;
	handleSorting: (sort: string, dir: ChannelSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: ChannelsListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10,
};

const sortableChannelColumns = new Set<string>(['name', 'channelType', 'createdAt']);
const ChannelsListContext = createContext<ChannelsListContextValue | null>(null);

export function ChannelsListProvider({ children }: GlobalLayoutProps) {
	const [params, setParams] = useQueryStates(channelsSearchParams);
	const filters = useMemo(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			sort: params.sort,
			dir: params.dir,
		}),
		[params.dir, params.page, params.pageSize, params.search, params.sort],
	);

	const query = useChannelsQuery(filters);
	const pagination = query.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: ChannelSortDirection) => {
			if (!sortableChannelColumns.has(nextSort)) return;
			void setParams({ sort: nextSort as ChannelSort, dir: nextDir, page: 1 });
		},
		[setParams],
	);

	const handleOptionFilter = useCallback(
		(key: string, value?: string | string[] | null) => {
			const normalized = Array.isArray(value) ? value.join(',') : value;
			if (key === 'page') {
				void setParams({ page: Number(normalized) || 1 });
				return;
			}
			if (key === 'limit' || key === 'pageSize') {
				void setParams({ pageSize: Number(normalized) || defaultPagination.pageSize, page: 1 });
			}
		},
		[setParams],
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			void setParams({ search: value.trim() || null, page: 1 });
		},
		[setParams],
	);

	const handleResetAll = useCallback(() => {
		void setParams({ page: 1, pageSize: 10, search: null, sort: 'createdAt', dir: 'desc' });
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(query.refetch(), {
			loading: 'Refreshing channels...',
			success: 'Channels refreshed',
			error: 'Failed to refresh channels',
		});
	}, [query]);

	const value = useMemo<ChannelsListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination,
			isLoading: query.isLoading,
			isFetching: query.isFetching,
			error: query.error,
			search: params.search,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleResetAll,
			handleRefresh,
		}),
		[
			pagination,
			query.isLoading,
			query.isFetching,
			query.error,
			params.search,
			params.sort,
			params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleResetAll,
			handleRefresh,
		],
	);

	return <ChannelsListContext.Provider value={value}>{children}</ChannelsListContext.Provider>;
}

export function useChannelsList() {
	const context = useContext(ChannelsListContext);
	if (!context) {
		throw new Error('useChannelsList must be used within ChannelsListProvider');
	}
	return context;
}
