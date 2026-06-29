import type { WhatsAppCallbackResult } from '../types/whatsapp.types';
import { apiClient } from '@/lib/api/client';
import { apiRoute } from '@/routes/routes';

export async function getWhatsAppOAuthUrl(): Promise<{ url: string }> {
	return apiClient<{ url: string }>({
		method: 'GET',
		url: apiRoute.whatsappOAuthUrl,
	});
}

export async function whatsappOAuthCallback(data: {
	code: string;
	state: string;
}): Promise<WhatsAppCallbackResult> {
	return apiClient<WhatsAppCallbackResult>({
		method: 'POST',
		url: apiRoute.whatsappOAuthCallback,
		data,
	});
}

export async function connectWhatsAppPhoneNumbers(data: {
	whatsappAccountPublicId: string;
	phoneNumberIds: string[];
}): Promise<unknown> {
	return apiClient({
		method: 'POST',
		url: apiRoute.whatsappPhones,
		data,
	});
}

export async function refreshWhatsAppToken(): Promise<{ refreshed: boolean }> {
	return apiClient<{ refreshed: boolean }>({
		method: 'POST',
		url: apiRoute.whatsappTokenRefresh,
	});
}
