import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { disconnectChannel } from './channels.actions';
import { channelKeys } from './channels.keys';

export function useDisconnectChannelMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: disconnectChannel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: channelKeys.list() });
			toast.success('Channel disconnected successfully.');
		},
		onError: () => {
			toast.error('Failed to disconnect channel. Please try again.');
		},
	});

	return {
		disconnectChannel: mutateAsync,
		isDisconnectPending: isPending,
	};
}
