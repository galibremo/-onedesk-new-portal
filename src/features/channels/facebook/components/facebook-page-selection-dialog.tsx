"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useConnectPagesMutation } from "@/features/channels/facebook/actions/facebook.mutations";
import type { FacebookPageInfo } from "@/features/channels/facebook/types/facebook.types";

interface FacebookPageSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountId: string;
	pages: FacebookPageInfo[];
	onSuccess: () => void;
}

export function FacebookPageSelectionDialog({
	open,
	onOpenChange,
	accountId,
	pages,
	onSuccess
}: FacebookPageSelectionDialogProps) {
	const [selectedPageIds, setSelectedPageIds] = useState<string[]>(
		pages.map(p => p.facebookPageId)
	);
	const { connectPages, isConnectPending } = useConnectPagesMutation();

	const handleTogglePage = (pageId: string) => {
		setSelectedPageIds(prev =>
			prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
		);
	};

	const handleSubmit = async () => {
		if (selectedPageIds.length === 0) return;
		await connectPages({ facebookAccountPublicId: accountId, pageIds: selectedPageIds });
		onSuccess();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select Facebook Pages</DialogTitle>
					<DialogDescription>
						Choose which pages you want to connect to this platform.
					</DialogDescription>
				</DialogHeader>
				<div className="flex max-h-72 flex-col gap-3 overflow-y-auto py-2 pr-1">
					{pages.map(page => (
						<div
							key={page.facebookPageId}
							className="flex items-center gap-2 rounded-lg border p-3"
						>
							<Checkbox
								id={`page-${page.facebookPageId}`}
								checked={selectedPageIds.includes(page.facebookPageId)}
								onCheckedChange={() => handleTogglePage(page.facebookPageId)}
							/>
							<Avatar className="size-9 shrink-0">
								<AvatarImage src={page.profilePicture} alt={page.pageName} />
								<AvatarFallback className="text-xs">
									{page.pageName.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Label
								htmlFor={`page-${page.facebookPageId}`}
								className="flex cursor-pointer flex-col items-start gap-0"
							>
								<span className="text-sm font-medium">{page.pageName}</span>
								{page.pageCategory && (
									<span className="text-muted-foreground text-xs">{page.pageCategory}</span>
								)}
							</Label>
						</div>
					))}
					{pages.length === 0 && (
						<p className="text-muted-foreground py-4 text-center text-sm">
							No Facebook Pages found. Make sure you manage at least one Page.
						</p>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConnectPending}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isConnectPending || selectedPageIds.length === 0}
					>
						{isConnectPending
							? "Connecting..."
							: `Connect ${selectedPageIds.length} Page${selectedPageIds.length !== 1 ? "s" : ""}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

