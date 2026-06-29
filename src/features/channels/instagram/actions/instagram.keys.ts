export const instagramKeys = {
	all: ['instagram'] as const,
	accounts: () => [...instagramKeys.all, 'accounts'] as const,
};
