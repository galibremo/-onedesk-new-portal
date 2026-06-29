import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs';

const channelSortValues = ['name', 'channelType', 'createdAt'] as const;
const sortDirectionValues = ['asc', 'desc'] as const;

export const channelsSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(''),
	sort: parseAsStringEnum([...channelSortValues]).withDefault('createdAt'),
	dir: parseAsStringEnum([...sortDirectionValues]).withDefault('desc'),
};

export type ChannelSort = (typeof channelSortValues)[number];
export type ChannelSortDirection = (typeof sortDirectionValues)[number];
