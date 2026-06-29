'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useFacebookCallbackMutation } from '@/features/channels/facebook/actions/facebook.mutations';
import { FacebookPageSelectionDialog } from '@/features/channels/facebook/components/facebook-page-selection-dialog';
import type { FacebookCallbackResult } from '@/features/channels/facebook/types/facebook.types';
import { route } from '@/routes/routes';

export function FacebookCallbackClient() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { handleCallback, isCallbackPending } = useFacebookCallbackMutation();

	const [inPopup, setInPopup] = useState(false);
	const [callbackResult, setCallbackResult] = useState<FacebookCallbackResult | null>(null);
	const [selectionOpen, setSelectionOpen] = useState(false);
	const hasCalled = useRef(false);

	useEffect(() => {
		setInPopup(!!window.opener);
	}, []);

	useEffect(() => {
		if (hasCalled.current) return;

		const code = searchParams.get('code');
		const state = searchParams.get('state');

		if (!code || !state) {
			toast.error('Invalid OAuth callback. Please try connecting again.');
			if (window.opener) {
				window.close();
			} else {
				router.replace(route.private.channels);
			}
			return;
		}

		hasCalled.current = true;

		// Popup mode: hand off code + state to the parent window and close
		if (window.opener) {
			window.opener.postMessage(
				{ type: 'FACEBOOK_OAUTH_CODE', code, state },
				window.location.origin,
			);
			window.close();
			return;
		}

		// Redirect fallback: handle callback in this page
		handleCallback({ code, state })
			.then(result => {
				setCallbackResult(result);
				setSelectionOpen(true);
			})
			.catch(() => {
				toast.error('Failed to connect Facebook. Please try again.');
				router.replace(route.private.channels);
			});
	}, [handleCallback, router, searchParams]);

	const handleSelectionSuccess = () => {
		router.replace(route.private.channels);
	};

	// Popup mode: show a brief spinner overlay while the page closes
	if (inPopup) {
		return (
			<div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
				<div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
			</div>
		);
	}

	// Redirect fallback
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			{isCallbackPending && (
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
					<p className="text-muted-foreground text-sm">Connecting your Facebook account...</p>
				</div>
			)}
			{callbackResult && (
				<FacebookPageSelectionDialog
					open={selectionOpen}
					onOpenChange={setSelectionOpen}
					accountId={callbackResult.accountId}
					pages={callbackResult.pages}
					onSuccess={handleSelectionSuccess}
				/>
			)}
		</div>
	);
}
