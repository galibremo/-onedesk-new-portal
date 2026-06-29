import { useQuery } from '@tanstack/react-query';

import { listFacebookPages } from './facebook.actions';
import { facebookKeys } from './facebook.keys';
import type { FacebookPagesListQuery } from '../types/facebook.types';

export function useFacebookPagesQuery(query: FacebookPagesListQuery) {
	return useQuery({
		queryKey: facebookKeys.pagesList(query),
		queryFn: () => listFacebookPages(query),
	});
}
