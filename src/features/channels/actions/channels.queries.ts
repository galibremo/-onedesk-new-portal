import { useQuery } from '@tanstack/react-query';

import { listChannels } from './channels.actions';
import { channelKeys } from './channels.keys';
import type { ChannelsListQuery } from '../types/channels.types';

export function useChannelsQuery(query: ChannelsListQuery) {
	return useQuery({
		queryKey: channelKeys.listFiltered(query),
		queryFn: () => listChannels(query),
	});
}
