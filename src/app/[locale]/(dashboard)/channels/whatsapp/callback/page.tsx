import { Suspense } from "react";

import { WhatsAppCallbackClient } from "@/features/channels/whatsapp/components/whatsapp-callback-client";

export default function WhatsAppCallbackPage() {
	return (
		<Suspense>
			<WhatsAppCallbackClient />
		</Suspense>
	);
}

