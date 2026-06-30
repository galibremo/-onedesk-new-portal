"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersQuery } from "@/features/users/actions/users.queries";
import {
	useAddTeamMembersMutation,
	useRemoveTeamMembersMutation,
	useUpdateMemberRoleMutation
} from "@/features/teams/actions/teams.mutations";
import { useTeamMembersQuery } from "@/features/teams/actions/teams.queries";
import {
	addMembersFormSchema,
	type AddMembersFormValues
} from "@/features/teams/schemas/team-form.schema";
import type { ManagedTeam, TeamMember, TeamRole } from "@/features/teams/types/teams.types";
import { formatTeamRole } from "@/features/teams/utils/team-format";
import { handleRequestError } from "@/lib/api/handle-request-error";

interface TeamMembersDialogProps {
	team: ManagedTeam;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeamMembersDialog({ team, open, onOpenChange }: TeamMembersDialogProps) {
	const [membersPage, setMembersPage] = useState(1);

	const membersQuery = useTeamMembersQuery(
		{ teamId: team.id, page: membersPage, pageSize: 10 },
		open
	);

	const members = membersQuery.data?.rows ?? [];
	const membersTotal = membersQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(membersTotal / 10));

	const handleOpenChange = (next: boolean) => {
		if (!next) setMembersPage(1);
		onOpenChange(next);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Manage members</DialogTitle>
					<DialogDescription>{team.name}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6">
					<div className="grid gap-3">
						<h3 className="text-sm font-medium">
							Current members{membersTotal > 0 ? ` (${membersTotal})` : ""}
						</h3>
						<MembersList
							members={members}
							isLoading={membersQuery.isLoading}
							teamId={team.id}
							page={membersPage}
							totalPages={totalPages}
							onPageChange={setMembersPage}
						/>
					</div>

					<Separator />

					<AddMembersForm team={team} existingMemberIds={members.map(m => m.userId)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface MembersListProps {
	members: TeamMember[];
	isLoading: boolean;
	teamId: string;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

function MembersList({ members, isLoading, teamId, page, totalPages, onPageChange }: MembersListProps) {
	const router = useRouter();
	const updateRoleMutation = useUpdateMemberRoleMutation();
	const removeMemberMutation = useRemoveTeamMembersMutation();

	const handleRoleChange = useCallback(
		(userId: string, role: TeamRole) => {
			updateRoleMutation.mutate(
				{ teamId, userId, role },
				{
					onSuccess: () => toast.success("Role updated"),
					onError: error => handleRequestError(error, router, "Failed to update role")
				}
			);
		},
		[updateRoleMutation, router, teamId]
	);

	const handleRemove = useCallback(
		(userId: string) => {
			removeMemberMutation.mutate(
				{ teamId, memberIds: [userId] },
				{
					onSuccess: () => toast.success("Member removed"),
					onError: error => handleRequestError(error, router, "Failed to remove member")
				}
			);
		},
		[removeMemberMutation, router, teamId]
	);

	if (isLoading) {
		return (
			<div className="grid gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		);
	}

	if (members.length === 0) {
		return <p className="text-muted-foreground text-sm">No members yet.</p>;
	}

	return (
		<div className="grid gap-2">
			{members.map(member => {
				const initials = (member.name ?? member.email)
					.split(" ")
					.map(w => w[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				return (
					<div
						key={member.userId}
						className="flex items-center gap-3 rounded-lg border p-2"
					>
						<Avatar className="size-8 shrink-0">
							{member.image ? <AvatarImage src={member.image} alt={member.name ?? ""} /> : null}
							<AvatarFallback className="text-xs">{initials}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<div className="truncate text-sm font-medium">{member.name ?? member.email}</div>
							<div className="text-muted-foreground truncate text-xs">{member.email}</div>
						</div>
						<Badge
							variant="outline"
							className={
								member.status === "ACTIVE"
									? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
									: undefined
							}
						>
							{member.status}
						</Badge>
						<Select
							value={member.role}
							onValueChange={value => handleRoleChange(member.userId, value as TeamRole)}
							disabled={updateRoleMutation.isPending}
						>
							<SelectTrigger className="h-7 w-28 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
								<SelectItem value="AGENT">Agent</SelectItem>
							</SelectContent>
						</Select>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-7 shrink-0"
							onClick={() => handleRemove(member.userId)}
							disabled={removeMemberMutation.isPending}
						>
							<HugeiconsIcon icon={Cancel01Icon} className="size-4" />
							<span className="sr-only">Remove</span>
						</Button>
					</div>
				);
			})}
			{totalPages > 1 ? (
				<div className="flex items-center justify-end gap-2 pt-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
					>
						Previous
					</Button>
					<span className="text-muted-foreground text-sm">
						{page} / {totalPages}
					</span>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page >= totalPages}
						onClick={() => onPageChange(page + 1)}
					>
						Next
					</Button>
				</div>
			) : null}
		</div>
	);
}

interface AddMembersFormProps {
	team: ManagedTeam;
	existingMemberIds: string[];
}

function AddMembersForm({ team, existingMemberIds }: AddMembersFormProps) {
	const router = useRouter();
	const addMembersMutation = useAddTeamMembersMutation();

	const usersQuery = useUsersQuery({
		page: 1,
		pageSize: 100,
		sort: "name",
		dir: "asc"
	});

	const availableUsers = useMemo(() => {
		const rows = usersQuery.data?.rows ?? [];
		return rows.filter(
			u => u.role !== "SUPER_ADMIN" && !existingMemberIds.includes(u.id)
		);
	}, [usersQuery.data, existingMemberIds]);

	const form = useForm<AddMembersFormValues>({
		resolver: zodResolver(addMembersFormSchema),
		defaultValues: { members: [{ userId: "", role: "AGENT" }] }
	});

	const { fields, append, remove } = useFieldArray({ control: form.control, name: "members" });

	const onSubmit = useCallback(
		(values: AddMembersFormValues) => {
			addMembersMutation.mutate(
				{ teamId: team.id, members: values.members },
				{
					onSuccess: data => {
						toast.success(`${data.added} member(s) added`);
						form.reset({ members: [{ userId: "", role: "AGENT" }] });
					},
					onError: error => handleRequestError(error, router, "Failed to add members")
				}
			);
		},
		[addMembersMutation, router, team.id, form]
	);

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
				<h3 className="text-sm font-medium">Add members</h3>
				<FieldGroup className="gap-3">
					{fields.map((field, index) => (
						<div key={field.id} className="flex items-end gap-2">
							<Field className="flex-1">
								{index === 0 ? (
									<FieldLabel htmlFor={`member-user-${index}`}>User</FieldLabel>
								) : null}
								<Controller
									name={`members.${index}.userId`}
									control={form.control}
									render={({ field: f }) => (
										<Select
											value={f.value}
											onValueChange={f.onChange}
											disabled={addMembersMutation.isPending || usersQuery.isLoading}
										>
											<SelectTrigger id={`member-user-${index}`} className="w-full">
												<SelectValue placeholder="Select user" />
											</SelectTrigger>
											<SelectContent>
												{availableUsers.map(u => (
													<SelectItem key={u.id} value={u.id}>
														{u.name ?? u.email}
														{u.name ? (
															<span className="text-muted-foreground ml-1 text-xs">
																{u.email}
															</span>
														) : null}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</Field>
							<Field className="w-36 shrink-0">
								{index === 0 ? (
									<FieldLabel htmlFor={`member-role-${index}`}>Role</FieldLabel>
								) : null}
								<Controller
									name={`members.${index}.role`}
									control={form.control}
									render={({ field: f }) => (
										<Select
											value={f.value}
											onValueChange={value => f.onChange(value as TeamRole)}
											disabled={addMembersMutation.isPending}
										>
											<SelectTrigger id={`member-role-${index}`}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="TEAM_LEAD">
													{formatTeamRole("TEAM_LEAD")}
												</SelectItem>
												<SelectItem value="AGENT">
													{formatTeamRole("AGENT")}
												</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</Field>
							{fields.length > 1 ? (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="mb-0.5 shrink-0"
									onClick={() => remove(index)}
								>
									<HugeiconsIcon icon={Cancel01Icon} className="size-4" />
									<span className="sr-only">Remove row</span>
								</Button>
							) : null}
						</div>
					))}
				</FieldGroup>
				{form.formState.errors.members?.root?.message ? (
					<p className="text-destructive text-sm">
						{form.formState.errors.members.root.message}
					</p>
				) : null}
				<div className="flex items-center justify-between">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => append({ userId: "", role: "AGENT" })}
						disabled={addMembersMutation.isPending}
					>
						<HugeiconsIcon icon={UserAdd01Icon} data-icon="inline-start" />
						Add row
					</Button>
					<Button type="submit" size="sm" disabled={addMembersMutation.isPending}>
						{addMembersMutation.isPending ? "Adding" : "Add members"}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}
