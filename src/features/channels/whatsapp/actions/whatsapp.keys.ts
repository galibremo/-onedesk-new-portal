export const whatsappKeys = {
	all: ['whatsapp'] as const,
	phones: () => [...whatsappKeys.all, 'phones'] as const,
};
