import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { channelKeys } from '@/features/channels/actions/channels.keys';

import {
	connectFacebookPages,
	disconnectFacebookPage,
	facebookOAuthCallback,
} from './facebook.actions';

export function useFacebookCallbackMutation() {
	const { mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: facebookOAuthCallback,
	});
	return {
		handleCallback: mutateAsync,
		isCallbackPending: isPending,
		isCallbackError: isError,
		callbackError: error,
	};
}

export function useConnectPagesMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: connectFacebookPages,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: channelKeys.list() });
			toast.success('Facebook pages connected successfully!');
		},
		onError: () => {
			toast.error('Failed to connect Facebook pages. Please try again.');
		},
	});
	return {
		connectPages: mutateAsync,
		isConnectPending: isPending,
		isConnectError: isError,
		connectError: error,
	};
}

export function useDisconnectPageMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: disconnectFacebookPage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: channelKeys.list() });
			toast.success('Facebook page disconnected successfully.');
		},
		onError: () => {
			toast.error('Failed to disconnect page. Please try again.');
		},
	});
	return {
		disconnectPage: mutateAsync,
		isDisconnectPending: isPending,
	};
}
