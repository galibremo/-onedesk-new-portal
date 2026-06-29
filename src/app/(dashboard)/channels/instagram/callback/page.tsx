import { Suspense } from "react";

import { InstagramCallbackClient } from "@/features/channels/instagram/components/instagram-callback-client";

export default function InstagramCallbackPage() {
	return (
		<Suspense>
			<InstagramCallbackClient />
		</Suspense>
	);
}

