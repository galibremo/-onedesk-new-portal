export interface FacebookPageInfo {
	facebookPageId: string;
	pageName: string;
	pageCategory?: string;
	profilePicture?: string;
}

export interface FacebookCallbackResult {
	accountId: string;
	pages: FacebookPageInfo[];
}

export interface FacebookPage {
	id: string;
	facebookPageId: string;
	pageName: string;
	pageCategory?: string;
	profilePicture?: string;
	pageStatus: 'active' | 'disconnected';
	connectedAt: string;
	createdAt: string;
}

export type FacebookPagesListResponse = PaginatedData<FacebookPage>;

export interface FacebookPagesListQuery {
	page?: number;
	pageSize?: number;
	sort?: string;
	dir?: 'asc' | 'desc';
	search?: string;
}
