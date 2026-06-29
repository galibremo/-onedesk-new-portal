import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { channelKeys } from '@/features/channels/actions/channels.keys';

import { connectWhatsAppPhoneNumbers, whatsappOAuthCallback } from './whatsapp.actions';

export function useWhatsAppCallbackMutation() {
	const { mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: whatsappOAuthCallback,
	});
	return {
		handleCallback: mutateAsync,
		isCallbackPending: isPending,
		isCallbackError: isError,
		callbackError: error,
	};
}

export function useConnectPhoneNumbersMutation() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, isError, error } = useMutation({
		mutationFn: connectWhatsAppPhoneNumbers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: channelKeys.list() });
			toast.success('WhatsApp phone number connected successfully!');
		},
		onError: () => {
			toast.error('Failed to connect WhatsApp phone number. Please try again.');
		},
	});
	return {
		connectPhoneNumbers: mutateAsync,
		isConnectPending: isPending,
		isConnectError: isError,
		connectError: error,
	};
}
