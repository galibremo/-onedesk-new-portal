import type { InstagramCallbackResult } from '../types/instagram.types';
import { apiClient } from '@/lib/api/client';
import { apiRoute } from '@/routes/routes';

export async function getInstagramOAuthUrl(): Promise<{ url: string }> {
	return apiClient<{ url: string }>({
		method: 'GET',
		url: apiRoute.instagramOAuthUrl,
	});
}

export async function instagramOAuthCallback(data: {
	code: string;
	state: string;
}): Promise<InstagramCallbackResult> {
	return apiClient<InstagramCallbackResult>({
		method: 'POST',
		url: apiRoute.instagramOAuthCallback,
		data,
	});
}

export async function connectInstagramAccounts(data: {
	instagramAccountPublicId: string;
	instagramAccountIds: string[];
}): Promise<unknown> {
	return apiClient({
		method: 'POST',
		url: apiRoute.instagramAccounts,
		data,
	});
}

export async function refreshInstagramToken(): Promise<{ refreshed: boolean }> {
	return apiClient<{ refreshed: boolean }>({
		method: 'POST',
		url: apiRoute.instagramTokenRefresh,
	});
}
