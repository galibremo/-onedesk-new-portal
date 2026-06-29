export const facebookKeys = {
	all: ['facebook'] as const,
	pages: () => [...facebookKeys.all, 'pages'] as const,
	pagesList: (filters: object) => [...facebookKeys.pages(), 'list', filters] as const,
};
