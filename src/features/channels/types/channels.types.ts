export type ChannelType = 'facebook' | 'whatsapp' | 'instagram' | 'telegram';
export type ChannelStatus = 'active' | 'disconnected';

export interface Channel {
	id: string;
	name: string;
	channelType: ChannelType;
	status: ChannelStatus;
	createdAt: string;
}

export type ChannelsListResponse = PaginatedData<Channel>;

export interface ChannelsListQuery {
	page?: number;
	pageSize?: number;
	sort?: string;
	dir?: 'asc' | 'desc';
	search?: string;
}
