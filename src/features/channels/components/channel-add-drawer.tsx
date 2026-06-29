'use client';

import { Facebook01Icon, InstagramIcon, TelegramIcon, WhatsappIcon } from '@hugeicons/core-free-icons';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

import { ChannelTypeCard } from './channel-type-card';

interface ChannelAddDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onFacebookConnect: () => void;
	onWhatsAppConnect: () => void;
	onInstagramConnect: () => void;
}

export function ChannelAddDrawer({ open, onOpenChange, onFacebookConnect, onWhatsAppConnect, onInstagramConnect }: ChannelAddDrawerProps) {
	const handleFacebook = () => {
		onOpenChange(false);
		onFacebookConnect();
	};

	const handleWhatsApp = () => {
		onOpenChange(false);
		onWhatsAppConnect();
	};

	const handleInstagram = () => {
		onOpenChange(false);
		onInstagramConnect();
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col sm:max-w-sm">
				<SheetHeader>
					<SheetTitle>Add Channel</SheetTitle>
					<SheetDescription>Select a channel type to connect.</SheetDescription>
				</SheetHeader>
				<div className="flex flex-col gap-3 p-4">
					<ChannelTypeCard
						icon={Facebook01Icon}
						label="Facebook"
						description="Connect a Facebook Page to receive and reply to messages."
						onClick={handleFacebook}
					/>
					<ChannelTypeCard
						icon={WhatsappIcon}
						label="WhatsApp"
						description="Connect a WhatsApp Business number."
						onClick={handleWhatsApp}
					/>
					<ChannelTypeCard
						icon={InstagramIcon}
						label="Instagram"
						description="Connect an Instagram Professional account."
						onClick={handleInstagram}
					/>
					<ChannelTypeCard
						icon={TelegramIcon}
						label="Telegram"
						description="Connect a Telegram bot."
						comingSoon
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
