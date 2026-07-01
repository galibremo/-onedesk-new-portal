import type { Metadata } from "next";

import ChatInboxPage from "@/features/team-details/chat-inbox/components/chat-inbox-page";

export const metadata: Metadata = {
	title: "Chat Inbox",
	description: "Manage Chat Inbox."
};

export default function ChatInbox() {
	return <ChatInboxPage />;
}

