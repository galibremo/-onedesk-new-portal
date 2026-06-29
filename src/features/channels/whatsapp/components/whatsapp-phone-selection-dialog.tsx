'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

import { useConnectPhoneNumbersMutation } from '@/features/channels/whatsapp/actions/whatsapp.mutations';
import type { WhatsAppPhoneNumberInfo } from '@/features/channels/whatsapp/types/whatsapp.types';

interface WhatsAppPhoneSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountId: string;
	phoneNumbers: WhatsAppPhoneNumberInfo[];
	onSuccess: () => void;
}

export function WhatsAppPhoneSelectionDialog({
	open,
	onOpenChange,
	accountId,
	phoneNumbers,
	onSuccess,
}: WhatsAppPhoneSelectionDialogProps) {
	const [selectedPhoneIds, setSelectedPhoneIds] = useState<string[]>(
		phoneNumbers.map(p => p.phoneNumberId),
	);
	const { connectPhoneNumbers, isConnectPending } = useConnectPhoneNumbersMutation();

	const handleTogglePhone = (phoneNumberId: string) => {
		setSelectedPhoneIds(prev =>
			prev.includes(phoneNumberId)
				? prev.filter(id => id !== phoneNumberId)
				: [...prev, phoneNumberId],
		);
	};

	const handleSubmit = async () => {
		if (selectedPhoneIds.length === 0) return;
		await connectPhoneNumbers({
			whatsappAccountPublicId: accountId,
			phoneNumberIds: selectedPhoneIds,
		});
		onSuccess();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select WhatsApp Phone Numbers</DialogTitle>
					<DialogDescription>
						Choose which phone numbers you want to connect to this platform.
					</DialogDescription>
				</DialogHeader>
				<div className="flex max-h-72 flex-col gap-3 overflow-y-auto py-2 pr-1">
					{phoneNumbers.map(phone => (
						<div
							key={phone.phoneNumberId}
							className="flex items-center gap-2 rounded-lg border p-3"
						>
							<Checkbox
								id={`phone-${phone.phoneNumberId}`}
								checked={selectedPhoneIds.includes(phone.phoneNumberId)}
								onCheckedChange={() => handleTogglePhone(phone.phoneNumberId)}
							/>
							<Avatar className="size-9 shrink-0">
								<AvatarFallback className="text-xs">
									{phone.verifiedName.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Label
								htmlFor={`phone-${phone.phoneNumberId}`}
								className="flex cursor-pointer flex-col items-start gap-0"
							>
								<span className="text-sm font-medium">{phone.verifiedName}</span>
								<span className="text-muted-foreground text-xs">{phone.displayPhoneNumber}</span>
							</Label>
						</div>
					))}
					{phoneNumbers.length === 0 && (
						<p className="text-muted-foreground py-4 text-center text-sm">
							No WhatsApp phone numbers found. Make sure you manage at least one WhatsApp Business
							Account.
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
						disabled={isConnectPending || selectedPhoneIds.length === 0}
					>
						{isConnectPending
							? 'Connecting...'
							: `Connect ${selectedPhoneIds.length} Number${selectedPhoneIds.length !== 1 ? 's' : ''}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
