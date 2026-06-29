'use client';

import { Add01Icon, MessageMultiple02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { handleRequestError } from '@/lib/api/handle-request-error';
import { SetBreadcrumb } from '@/providers/breadcrumb-provider';
import { route } from '@/routes/routes';
import { getFacebookOAuthUrl } from '@/features/channels/facebook/actions/facebook.actions';
import { useFacebookCallbackMutation } from '@/features/channels/facebook/actions/facebook.mutations';
import { FacebookPageSelectionDialog } from '@/features/channels/facebook/components/facebook-page-selection-dialog';
import type { FacebookCallbackResult } from '@/features/channels/facebook/types/facebook.types';
import { getWhatsAppOAuthUrl } from '@/features/channels/whatsapp/actions/whatsapp.actions';
import { useWhatsAppCallbackMutation } from '@/features/channels/whatsapp/actions/whatsapp.mutations';
import { WhatsAppPhoneSelectionDialog } from '@/features/channels/whatsapp/components/whatsapp-phone-selection-dialog';
import type { WhatsAppCallbackResult } from '@/features/channels/whatsapp/types/whatsapp.types';
import { getInstagramOAuthUrl } from '@/features/channels/instagram/actions/instagram.actions';
import { useInstagramCallbackMutation } from '@/features/channels/instagram/actions/instagram.mutations';
import { InstagramAccountSelectionDialog } from '@/features/channels/instagram/components/instagram-account-selection-dialog';
import type { InstagramCallbackResult } from '@/features/channels/instagram/types/instagram.types';

import { ChannelsListProvider, useChannelsList } from '../hooks/use-channels-list';
import { ChannelAddDrawer } from './channel-add-drawer';
import { ChannelsTable } from './channels-table';

const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 750;

const breadcrumbItems = [
	{ name: 'Dashboard', href: route.private.dashboard },
	{ name: 'Channels', isCurrent: true },
];

function popupFeatures(width: number, height: number) {
	const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
	const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
	return `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`;
}

export function ChannelsPage() {
	return (
		<ChannelsListProvider>
			<ChannelsPageContent />
		</ChannelsListProvider>
	);
}

function ChannelsPageContent() {
	const router = useRouter();
	const { error } = useChannelsList();

	const [drawerOpen, setDrawerOpen] = useState(false);

	// Facebook state
	const [isPending, setIsPending] = useState(false);
	const [callbackResult, setCallbackResult] = useState<FacebookCallbackResult | null>(null);
	const [selectionOpen, setSelectionOpen] = useState(false);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const codeReceivedRef = useRef(false);
	const { handleCallback, isCallbackPending } = useFacebookCallbackMutation();

	// WhatsApp state
	const [isWaPending, setIsWaPending] = useState(false);
	const [waCallbackResult, setWaCallbackResult] = useState<WhatsAppCallbackResult | null>(null);
	const [waSelectionOpen, setWaSelectionOpen] = useState(false);
	const waPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const waCodeReceivedRef = useRef(false);
	const { handleCallback: handleWaCallback, isCallbackPending: isWaCallbackPending } = useWhatsAppCallbackMutation();

	// Instagram state
	const [isIgPending, setIsIgPending] = useState(false);
	const [igCallbackResult, setIgCallbackResult] = useState<InstagramCallbackResult | null>(null);
	const [igSelectionOpen, setIgSelectionOpen] = useState(false);
	const igPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const igCodeReceivedRef = useRef(false);
	const { handleCallback: handleIgCallback, isCallbackPending: isIgCallbackPending } = useInstagramCallbackMutation();

	const clearPoll = () => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
	};

	const clearWaPoll = () => {
		if (waPollRef.current) {
			clearInterval(waPollRef.current);
			waPollRef.current = null;
		}
	};

	const clearIgPoll = () => {
		if (igPollRef.current) {
			clearInterval(igPollRef.current);
			igPollRef.current = null;
		}
	};

	useEffect(() => {
		if (!error) return;
		handleRequestError(error, router, 'Failed to load channels');
	}, [error, router]);

	useEffect(() => {
		const onMessage = async (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			const { code, state } = event.data as { type: string; code: string; state: string };

			if (event.data?.type === 'FACEBOOK_OAUTH_CODE') {
				clearPoll();
				codeReceivedRef.current = true;
				try {
					const result = await handleCallback({ code, state });
					setCallbackResult(result);
					setSelectionOpen(true);
				} catch {
					toast.error('Failed to connect Facebook. Please try again.');
					setIsPending(false);
				}
			}

			if (event.data?.type === 'WHATSAPP_OAUTH_CODE') {
				clearWaPoll();
				waCodeReceivedRef.current = true;
				try {
					const result = await handleWaCallback({ code, state });
					setWaCallbackResult(result);
					setWaSelectionOpen(true);
				} catch {
					toast.error('Failed to connect WhatsApp. Please try again.');
					setIsWaPending(false);
				}
			}

			if (event.data?.type === 'INSTAGRAM_OAUTH_CODE') {
				clearIgPoll();
				igCodeReceivedRef.current = true;
				try {
					const result = await handleIgCallback({ code, state });
					setIgCallbackResult(result);
					setIgSelectionOpen(true);
				} catch {
					toast.error('Failed to connect Instagram. Please try again.');
					setIsIgPending(false);
				}
			}
		};

		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [handleCallback, handleWaCallback, handleIgCallback]);

	const handleFacebookConnect = async () => {
		setIsPending(true);
		codeReceivedRef.current = false;

		try {
			const { url } = await getFacebookOAuthUrl();
			const popup = window.open(url, 'facebook_oauth', popupFeatures(POPUP_WIDTH, POPUP_HEIGHT));

			if (!popup) {
				window.location.href = url;
				return;
			}

			popup.focus();

			pollRef.current = setInterval(() => {
				if (popup.closed) {
					clearPoll();
					if (!codeReceivedRef.current) {
						setIsPending(false);
					}
				}
			}, 500);
		} catch {
			toast.error('Failed to initiate Facebook connection. Please try again.');
			setIsPending(false);
		}
	};

	const handleWhatsAppConnect = async () => {
		setIsWaPending(true);
		waCodeReceivedRef.current = false;

		try {
			const { url } = await getWhatsAppOAuthUrl();
			const popup = window.open(url, 'whatsapp_oauth', popupFeatures(POPUP_WIDTH, POPUP_HEIGHT));

			if (!popup) {
				window.location.href = url;
				return;
			}

			popup.focus();

			waPollRef.current = setInterval(() => {
				if (popup.closed) {
					clearWaPoll();
					if (!waCodeReceivedRef.current) {
						setIsWaPending(false);
					}
				}
			}, 500);
		} catch {
			toast.error('Failed to initiate WhatsApp connection. Please try again.');
			setIsWaPending(false);
		}
	};

	const handleSelectionOpenChange = (open: boolean) => {
		setSelectionOpen(open);
		if (!open) {
			setCallbackResult(null);
			setIsPending(false);
		}
	};

	const handleWaSelectionOpenChange = (open: boolean) => {
		setWaSelectionOpen(open);
		if (!open) {
			setWaCallbackResult(null);
			setIsWaPending(false);
		}
	};

	const handleInstagramConnect = async () => {
		setIsIgPending(true);
		igCodeReceivedRef.current = false;

		try {
			const { url } = await getInstagramOAuthUrl();
			const popup = window.open(url, 'instagram_oauth', popupFeatures(POPUP_WIDTH, POPUP_HEIGHT));

			if (!popup) {
				window.location.href = url;
				return;
			}

			popup.focus();

			igPollRef.current = setInterval(() => {
				if (popup.closed) {
					clearIgPoll();
					if (!igCodeReceivedRef.current) {
						setIsIgPending(false);
					}
				}
			}, 500);
		} catch {
			toast.error('Failed to initiate Instagram connection. Please try again.');
			setIsIgPending(false);
		}
	};

	const handleIgSelectionOpenChange = (open: boolean) => {
		setIgSelectionOpen(open);
		if (!open) {
			setIgCallbackResult(null);
			setIsIgPending(false);
		}
	};

	const isAnyPending = isPending || isCallbackPending || isWaPending || isWaCallbackPending || isIgPending || isIgCallbackPending;
	const addChannelLabel = (isCallbackPending || isWaCallbackPending || isIgCallbackPending) ? 'Connecting...' : (isPending || isWaPending || isIgPending) ? 'Waiting...' : 'Add Channel';

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={MessageMultiple02Icon} className="text-primary size-6" />
							Channels
						</h1>
						<p className="text-muted-foreground text-sm">
							Connect and manage your social media channels for messaging and engagement.
						</p>
					</div>
					<Button
						onClick={() => setDrawerOpen(true)}
						disabled={isAnyPending}
					>
						<HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
						{addChannelLabel}
					</Button>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Connected Channels</CardTitle>
						<CardDescription>
							Manage your connected social media channels and their configuration.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<ChannelsTable />
					</CardContent>
				</Card>
			</div>

			<ChannelAddDrawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				onFacebookConnect={handleFacebookConnect}
				onWhatsAppConnect={handleWhatsAppConnect}
				onInstagramConnect={handleInstagramConnect}
			/>

			{callbackResult && (
				<FacebookPageSelectionDialog
					open={selectionOpen}
					onOpenChange={handleSelectionOpenChange}
					accountId={callbackResult.accountId}
					pages={callbackResult.pages}
					onSuccess={() => handleSelectionOpenChange(false)}
				/>
			)}

			{waCallbackResult && (
				<WhatsAppPhoneSelectionDialog
					open={waSelectionOpen}
					onOpenChange={handleWaSelectionOpenChange}
					accountId={waCallbackResult.accountId}
					phoneNumbers={waCallbackResult.phoneNumbers}
					onSuccess={() => handleWaSelectionOpenChange(false)}
				/>
			)}

			{igCallbackResult && (
				<InstagramAccountSelectionDialog
					open={igSelectionOpen}
					onOpenChange={handleIgSelectionOpenChange}
					accountId={igCallbackResult.accountId}
					accounts={igCallbackResult.accounts}
					onSuccess={() => handleIgSelectionOpenChange(false)}
				/>
			)}
		</>
	);
}
