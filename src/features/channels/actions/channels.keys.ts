export const channelKeys = {
	all: ['channels'] as const,
	list: () => [...channelKeys.all, 'list'] as const,
	listFiltered: (filters: object) => [...channelKeys.list(), filters] as const,
};
