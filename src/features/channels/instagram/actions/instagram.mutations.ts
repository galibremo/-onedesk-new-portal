import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { channelKeys } from '@/features/channels/actions/channels.keys';

import { connectInstagramAccounts, instagramOAuthCallback } from './instagram.actions';

export function useInstagramCallbackMutation() {
	const { mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: instagramOAuthCallback,
	});
	return {
		handleCallback: mutateAsync,
		isCallbackPending: isPending,
		isCallbackError: isError,
		callbackError: error,
	};
}

export function useConnectInstagramAccountsMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: connectInstagramAccounts,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: channelKeys.list() });
			toast.success('Instagram account connected successfully!');
		},
		onError: () => {
			toast.error('Failed to connect Instagram account. Please try again.');
		},
	});
	return {
		connectAccounts: mutateAsync,
		isConnectPending: isPending,
		isConnectError: isError,
		connectError: error,
	};
}
