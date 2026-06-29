'use client';

import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChannelTypeCardProps {
	icon: IconSvgElement;
	label: string;
	description?: string;
	comingSoon?: boolean;
	onClick?: () => void;
}

export function ChannelTypeCard({
	icon,
	label,
	description,
	comingSoon = false,
	onClick,
}: ChannelTypeCardProps) {
	return (
		<button
			type="button"
			disabled={comingSoon}
			onClick={onClick}
			className={cn(
				'flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors',
				comingSoon
					? 'cursor-not-allowed opacity-50'
					: 'hover:bg-accent hover:border-primary cursor-pointer',
			)}
		>
			<div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
				<HugeiconsIcon icon={icon} className="size-5" />
			</div>
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">{label}</span>
					{comingSoon && (
						<Badge variant="secondary" className="text-xs">
							Coming Soon
						</Badge>
					)}
				</div>
				{description && (
					<p className="text-muted-foreground text-xs">{description}</p>
				)}
			</div>
			<HugeiconsIcon icon={ArrowRight01Icon} className="text-muted-foreground size-4 shrink-0" />
		</button>
	);
}
