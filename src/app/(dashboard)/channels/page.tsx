import type { Metadata } from 'next';

import { ChannelsPage } from '@/features/channels';

export const metadata: Metadata = {
	title: 'Channels',
	description: 'Manage your connected social media channels.',
};

export default function Channels() {
	return <ChannelsPage />;
}
