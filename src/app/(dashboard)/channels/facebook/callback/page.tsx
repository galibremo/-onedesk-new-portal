import { Suspense } from "react";

import { FacebookCallbackClient } from "@/features/channels/facebook/components/facebook-callback-client";

export default function FacebookCallbackPage() {
	return (
		<Suspense>
			<FacebookCallbackClient />
		</Suspense>
	);
}

