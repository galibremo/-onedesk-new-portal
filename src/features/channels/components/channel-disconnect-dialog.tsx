'use client';

import { LinkSquare02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDisconnectChannelMutation } from '@/features/channels/actions/channels.mutations';
import type { Channel } from '@/features/channels/types/channels.types';

interface ChannelDisconnectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	channel: Channel;
}

export function ChannelDisconnectDialog({
	open,
	onOpenChange,
	channel,
}: ChannelDisconnectDialogProps) {
	const { disconnectChannel, isDisconnectPending } = useDisconnectChannelMutation();

	const handleDisconnect = async () => {
		await disconnectChannel(channel.id);
		onOpenChange(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={LinkSquare02Icon} />
					</AlertDialogMedia>
					<AlertDialogTitle>Disconnect Channel?</AlertDialogTitle>
					<AlertDialogDescription>
						This will disconnect <strong>{channel.name}</strong> from this platform. You can
						reconnect it later by going through the connect flow again.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={handleDisconnect}
						disabled={isDisconnectPending}
					>
						{isDisconnectPending ? 'Disconnecting...' : 'Disconnect'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
