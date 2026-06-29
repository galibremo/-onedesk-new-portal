import type {
	FacebookCallbackResult,
	FacebookPagesListQuery,
	FacebookPagesListResponse
} from "../types/facebook.types";

import { apiClient } from "@/lib/api/client";

import { apiRoute } from "@/routes/routes";

export async function getFacebookOAuthUrl(): Promise<{ url: string }> {
	return apiClient<{ url: string }>({
		method: "GET",
		url: apiRoute.facebookOAuthUrl
	});
}

export async function facebookOAuthCallback(data: {
	code: string;
	state: string;
}): Promise<FacebookCallbackResult> {
	return apiClient<FacebookCallbackResult>({
		method: "POST",
		url: apiRoute.facebookOAuthCallback,
		data
	});
}

export async function connectFacebookPages(data: {
	facebookAccountPublicId: string;
	pageIds: string[];
}): Promise<FacebookPagesListResponse> {
	return apiClient<FacebookPagesListResponse>({
		method: "POST",
		url: apiRoute.facebookPages,
		data
	});
}

export async function listFacebookPages(
	query: FacebookPagesListQuery
): Promise<FacebookPagesListResponse> {
	return apiClient<FacebookPagesListResponse>({
		method: "GET",
		url: apiRoute.facebookPages,
		params: query
	});
}

export async function disconnectFacebookPage(pageId: string): Promise<{ disconnected: boolean }> {
	return apiClient<{ disconnected: boolean }>({
		method: "DELETE",
		url: apiRoute.facebookPage(pageId)
	});
}

export async function refreshFacebookToken(): Promise<{ refreshed: boolean }> {
	return apiClient<{ refreshed: boolean }>({
		method: "POST",
		url: apiRoute.facebookTokenRefresh
	});
}

