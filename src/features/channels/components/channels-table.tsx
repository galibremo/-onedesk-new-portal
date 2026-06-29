'use client';

import {
	Cancel01Icon,
	Facebook01Icon,
	InstagramIcon,
	RefreshIcon,
	Search,
	TelegramIcon,
	WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ColumnDef, Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

import { DataTable } from '@/components/common/table/data-table';
import { DataTableColumnHeader } from '@/components/common/table/data-table-column-header';
import { DataTableViewOptions } from '@/components/common/table/data-table-view-options';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useChannelsList } from '@/features/channels/hooks/use-channels-list';
import type { Channel, ChannelType } from '@/features/channels/types/channels.types';
import { ChannelDisconnectDialog } from './channel-disconnect-dialog';

const CHANNEL_ICONS: Record<ChannelType, typeof Facebook01Icon> = {
	facebook: Facebook01Icon,
	whatsapp: WhatsappIcon,
	instagram: InstagramIcon,
	telegram: TelegramIcon,
};

const CHANNEL_LABELS: Record<ChannelType, string> = {
	facebook: 'Facebook',
	whatsapp: 'WhatsApp',
	instagram: 'Instagram',
	telegram: 'Telegram',
};

interface ChannelsColumnsOptions {
	sort: string;
	dir: 'asc' | 'desc';
	handleSorting: (sort: string, dir: 'asc' | 'desc') => void;
}

function createChannelsColumns({
	sort,
	dir,
	handleSorting,
}: ChannelsColumnsOptions): ColumnDef<Channel>[] {
	return [
		{
			accessorKey: 'name',
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Channel"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => {
				const channel = row.original;
				const Icon = CHANNEL_ICONS[channel.channelType];
				return (
					<div className="flex items-center gap-3">
						<div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
							<HugeiconsIcon icon={Icon} className="size-4" />
						</div>
						<span className="text-sm font-medium">{channel.name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: 'channelType',
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Type"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<Badge variant="secondary">{CHANNEL_LABELS[row.original.channelType]}</Badge>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => (
				<Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
					{row.original.status === 'active' ? 'Active' : 'Disconnected'}
				</Badge>
			),
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Connected"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) =>
				new Date(row.original.createdAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				}),
		},
		{
			id: 'actions',
			header: 'Action',
			cell: ({ row }) => <ChannelRowActions channel={row.original} />,
		},
	];
}

function ChannelRowActions({ channel }: { channel: Channel }) {
	const [disconnectOpen, setDisconnectOpen] = useState(false);
	return (
		<>
			<Button
				type="button"
				variant="destructive"
				size="sm"
				onClick={() => setDisconnectOpen(true)}
			>
				Disconnect
			</Button>
			<ChannelDisconnectDialog
				open={disconnectOpen}
				onOpenChange={setDisconnectOpen}
				channel={channel}
			/>
		</>
	);
}

function ChannelsTableToolbar<TData>({ table }: { table: Table<TData> }) {
	const { search, isFetching, handleSearchChange, handleResetAll, handleRefresh } =
		useChannelsList();
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebouncedValue(searchInput, 400);
	const hasFilters = Boolean(search);

	useEffect(() => {
		if (debouncedSearch === search) return;
		handleSearchChange(debouncedSearch);
	}, [debouncedSearch, handleSearchChange, search]);

	return (
		<div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end">
				<Field className="gap-1 sm:max-w-72">
					<InputGroup className="h-8 max-w-xs">
						<InputGroupInput
							id="channels-search"
							value={searchInput}
							placeholder="Search channels..."
							onChange={e => setSearchInput(e.target.value)}
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Search} data-icon="inline-start" />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<AiFillCloseCircle
								className={cn('cursor-pointer', !searchInput && 'invisible')}
								onClick={() => {
									setSearchInput('');
									handleSearchChange('');
								}}
							/>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				{hasFilters && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => {
							setSearchInput('');
							handleResetAll();
						}}
					>
						Reset
						<HugeiconsIcon icon={Cancel01Icon} />
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				<Button type="button" size="sm" onClick={handleRefresh} disabled={isFetching}>
					<HugeiconsIcon
						icon={RefreshIcon}
						data-icon="inline-start"
						className={isFetching ? 'animate-spin' : undefined}
					/>
					Refresh
				</Button>
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}

export function ChannelsTable() {
	const { tableData, pagination, isLoading, handleOptionFilter, sort, dir, handleSorting } =
		useChannelsList();
	const columns = useMemo(
		() => createChannelsColumns({ sort, dir, handleSorting }),
		[sort, dir, handleSorting],
	);

	return (
		<DataTable
			columns={columns}
			isLoading={isLoading}
			data={tableData}
			pagination={pagination}
			handleOptionFilter={handleOptionFilter}
			DataTableToolbar={ChannelsTableToolbar}
			emptyTitle="No channels connected"
			emptyDescription="Add a channel to get started."
		/>
	);
}
