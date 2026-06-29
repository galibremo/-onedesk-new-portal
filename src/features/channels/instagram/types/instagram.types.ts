export interface InstagramAccountInfo {
	instagramAccountId: string;
	instagramUsername: string;
	instagramName: string;
	profilePictureUrl?: string;
	followersCount?: number;
	facebookPageId: string;
	facebookPageName: string;
}

export interface InstagramCallbackResult {
	accountId: string;
	accounts: InstagramAccountInfo[];
}
