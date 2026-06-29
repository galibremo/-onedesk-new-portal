'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { useConnectInstagramAccountsMutation } from '@/features/channels/instagram/actions/instagram.mutations';
import type { InstagramAccountInfo } from '@/features/channels/instagram/types/instagram.types';

interface InstagramAccountSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountId: string;
	accounts: InstagramAccountInfo[];
	onSuccess: () => void;
}

export function InstagramAccountSelectionDialog({
	open,
	onOpenChange,
	accountId,
	accounts,
	onSuccess,
}: InstagramAccountSelectionDialogProps) {
	const [selectedIds, setSelectedIds] = useState<string[]>(
		accounts.map(a => a.instagramAccountId),
	);
	const { connectAccounts, isConnectPending } = useConnectInstagramAccountsMutation();

	const handleToggle = (instagramAccountId: string) => {
		setSelectedIds(prev =>
			prev.includes(instagramAccountId)
				? prev.filter(id => id !== instagramAccountId)
				: [...prev, instagramAccountId],
		);
	};

	const handleSubmit = async () => {
		if (selectedIds.length === 0) return;
		await connectAccounts({
			instagramAccountPublicId: accountId,
			instagramAccountIds: selectedIds,
		});
		onSuccess();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select Instagram Accounts</DialogTitle>
					<DialogDescription>
						Choose which Instagram Professional accounts you want to connect to this platform.
					</DialogDescription>
				</DialogHeader>
				<div className="flex max-h-72 flex-col gap-3 overflow-y-auto py-2 pr-1">
					{accounts.map(account => (
						<div
							key={account.instagramAccountId}
							className="flex items-center gap-2 rounded-lg border p-3"
						>
							<Checkbox
								id={`ig-${account.instagramAccountId}`}
								checked={selectedIds.includes(account.instagramAccountId)}
								onCheckedChange={() => handleToggle(account.instagramAccountId)}
							/>
							<Avatar className="size-9 shrink-0">
								{account.profilePictureUrl && (
									<AvatarImage
										src={account.profilePictureUrl}
										alt={account.instagramName}
									/>
								)}
								<AvatarFallback className="text-xs">
									{account.instagramName.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Label
								htmlFor={`ig-${account.instagramAccountId}`}
								className="flex cursor-pointer flex-col items-start gap-0"
							>
								<span className="text-sm font-medium">{account.instagramName}</span>
								<span className="text-muted-foreground text-xs">
									@{account.instagramUsername}
									{account.followersCount !== undefined &&
										` · ${account.followersCount.toLocaleString()} followers`}
								</span>
							</Label>
						</div>
					))}
					{accounts.length === 0 && (
						<p className="text-muted-foreground py-4 text-center text-sm">
							No Instagram Professional accounts found. Make sure your Instagram account is a
							Business or Creator account and is linked to a Facebook Page you manage.
						</p>
					)}
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isConnectPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isConnectPending || selectedIds.length === 0}
					>
						{isConnectPending
							? 'Connecting...'
							: `Connect ${selectedIds.length} Account${selectedIds.length !== 1 ? 's' : ''}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
