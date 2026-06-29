import { apiClient } from '@/lib/api/client';
import { apiRoute } from '@/routes/routes';

import type { ChannelsListQuery, ChannelsListResponse } from '../types/channels.types';

export async function listChannels(query: ChannelsListQuery): Promise<ChannelsListResponse> {
	return apiClient<ChannelsListResponse>({
		method: 'GET',
		url: apiRoute.channels,
		params: query,
	});
}

export async function disconnectChannel(channelId: string): Promise<{ disconnected: boolean }> {
	return apiClient<{ disconnected: boolean }>({
		method: 'DELETE',
		url: apiRoute.channel(channelId),
	});
}
