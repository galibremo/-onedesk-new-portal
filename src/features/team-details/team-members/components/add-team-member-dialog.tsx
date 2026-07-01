"use client";

import { Cancel01Icon, PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { handleRequestError } from "@/lib/api/handle-request-error";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Creatable } from "@/components/common/react-select/creatable";
import type { OptionProps } from "react-select";
import { components } from "react-select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { useAddTeamMembersMutation } from "@/features/team-details/team-members/actions/team-members.mutations";
import type { TeamRole } from "@/features/team-details/team-members/types/team-members.types";
import { formatTeamRole } from "@/features/team-details/team-members/utils/team-members-format";
import { useUsersQuery } from "@/features/users/actions/users.queries";

interface AddTeamMemberDialogProps {
	teamId: string;
	existingMemberIds: string[];
}

interface StagedMember {
	userId: string;
	role: TeamRole;
	name: string | null;
	email: string;
	image: string | null;
}

export function AddTeamMemberDialog({ teamId, existingMemberIds }: AddTeamMemberDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const addMembersMutation = useAddTeamMembersMutation();
	const [staged, setStaged] = useState<StagedMember[]>([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [selectedRole, setSelectedRole] = useState<TeamRole>("AGENT");
	const [pendingOption, setPendingOption] = useState<{ value: string; label: string } | null>(null);

	const usersQuery = useUsersQuery();

	const userOptions = useMemo(() => {
		const rows = usersQuery.data?.rows ?? [];
		return rows
			.filter(
				u =>
					u.role !== "SUPER_ADMIN" &&
					!existingMemberIds.includes(u.id) &&
					!staged.some(s => s.userId === u.id)
			)
			.map(u => ({
				value: u.id,
				label: u.name ?? u.email,
				image: u.image,
				email: u.email,
				name: u.name
			}));
	}, [usersQuery.data, existingMemberIds, staged]);

	const selectedUserOption = useMemo(
		() => userOptions.find(o => o.value === selectedUserId) ?? pendingOption,
		[userOptions, selectedUserId, pendingOption]
	);

	const UserOption = (props: OptionProps) => {
		const data = props.data as { value?: string; label?: string; image?: string | null; email?: string; name?: string | null };
		const displayName = data.label ?? "";
		const email = data.email ?? "";

		if (!email && !data.image) {
			return (
				<components.Option {...props}>
					<div className="text-sm">{displayName}</div>
				</components.Option>
			);
		}

		const name = data.name ?? displayName;
		const initials = name
			.split(" ")
			.map((w: string) => w[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

		return (
			<components.Option {...props}>
				<div className="flex items-center gap-2">
					<Avatar className="size-6">
						{data.image ? <AvatarImage src={data.image} alt={displayName} /> : null}
						<AvatarFallback className="text-xs">{initials}</AvatarFallback>
					</Avatar>
					<div>
						<div className="text-sm font-medium">{displayName}</div>
						{data.name ? (
							<div className="text-muted-foreground text-xs">{email}</div>
						) : null}
					</div>
				</div>
			</components.Option>
		);
	};

	const handleAddRow = useCallback(() => {
		if (!selectedUserId) {
			toast.error("Please select a user");
			return;
		}

		const user = userOptions.find(u => u.value === selectedUserId);

		const newMember: StagedMember = user
			? {
					userId: user.value,
					role: selectedRole,
					name: user.name,
					email: user.email,
					image: user.image
				}
			: {
					userId: selectedUserId,
					role: selectedRole,
					name: null,
					email: selectedUserId,
					image: null
				};

		if (staged.some(m => m.userId === newMember.userId)) {
			toast.error("User already added");
			return;
		}

		setStaged([...staged, newMember]);
		setSelectedUserId("");
		setPendingOption(null);
		setSelectedRole("AGENT");
	}, [selectedUserId, selectedRole, userOptions, staged]);

	const handleRemoveStaged = useCallback(
		(userId: string) => {
			setStaged(staged.filter(m => m.userId !== userId));
		},
		[staged]
	);

	const handleSubmit = useCallback(() => {
		if (staged.length === 0) {
			toast.error("Please add at least one member");
			return;
		}

		addMembersMutation.mutate(
			{
				teamId,
				members: staged.map(m => ({ userId: m.userId, role: m.role }))
			},
			{
				onSuccess: data => {
					toast.success(`${data.added} member(s) added`);
					setOpen(false);
					setStaged([]);
					setSelectedUserId("");
					setPendingOption(null);
					setSelectedRole("AGENT");
				},
				onError: error => {
					handleRequestError(error, router, "Failed to add members");
				}
			}
		);
	}, [staged, addMembersMutation, teamId, router, setOpen]);

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setStaged([]);
			setSelectedUserId("");
			setPendingOption(null);
			setSelectedRole("AGENT");
		}
		setOpen(next);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button type="button" onClick={() => handleOpenChange(true)}>
				<HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
				Add members
			</Button>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Add members</DialogTitle>
					<DialogDescription>View your all org members here.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6">
					<div className="grid gap-3">
						<h3 className="text-sm font-medium">Invite members</h3>
						<div className="flex items-end gap-3">
							<Field className="flex-1">
								<FieldLabel htmlFor="member-search">User</FieldLabel>
								<Creatable
									inputId="member-search"
									value={selectedUserOption}
									onChange={option => {
										const selected = option as { value: string; label: string } | null;
										if (selected && !Array.isArray(option)) {
											setSelectedUserId(selected.value);
											if (!userOptions.some(o => o.value === selected.value)) {
												setPendingOption(selected);
											} else {
												setPendingOption(null);
											}
										} else {
											setSelectedUserId("");
											setPendingOption(null);
										}
									}}
									options={userOptions}
									isDisabled={addMembersMutation.isPending || usersQuery.isLoading}
									placeholder="Search by name or email..."
									components={{ Option: UserOption }}
									isSearchable
									isClearable
								/>
							</Field>
							<Field className="w-36 shrink-0">
								<FieldLabel htmlFor="member-role">Org Role</FieldLabel>
								<Select
									value={selectedRole}
									onValueChange={value => setSelectedRole(value as TeamRole)}
									disabled={addMembersMutation.isPending}
								>
									<SelectTrigger id="member-role">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="TEAM_LEAD">{formatTeamRole("TEAM_LEAD")}</SelectItem>
										<SelectItem value="AGENT">{formatTeamRole("AGENT")}</SelectItem>
									</SelectContent>
								</Select>
							</Field>
							<Button
								type="button"
								size="icon"
								onClick={handleAddRow}
								disabled={addMembersMutation.isPending || !selectedUserId}
								className="shrink-0"
							>
								+
							</Button>
						</div>
					</div>

					{staged.length > 0 ? (
						<>
							<Separator />
							<div className="grid gap-3">
								<h3 className="text-sm font-medium">
									Staged members{staged.length > 0 ? ` (${staged.length})` : ""}
								</h3>
								<div className="grid gap-2">
									{staged.map(member => {
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
													{member.image ? (
														<AvatarImage src={member.image} alt={member.name ?? ""} />
													) : null}
													<AvatarFallback className="text-xs">{initials}</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<div className="truncate text-sm font-medium">
														{member.name ?? member.email}
													</div>
													<div className="text-muted-foreground truncate text-xs">
														{member.email}
													</div>
												</div>
												<Badge variant="outline">{formatTeamRole(member.role)}</Badge>
												<Button
													type="button"
													variant="destructive"
													size="icon"
													className="size-6 shrink-0 rounded-full"
													onClick={() => handleRemoveStaged(member.userId)}
													disabled={addMembersMutation.isPending}
												>
													<HugeiconsIcon icon={Cancel01Icon} className="size-3" />
													<span className="sr-only">Remove</span>
												</Button>
											</div>
										);
									})}
								</div>
							</div>
						</>
					) : null}
				</div>
				{staged.length === 0 && (
					<div className="border-muted-foreground/30 rounded-lg border-2 border-dashed p-8 text-center">
						<p className="text-muted-foreground text-sm">
							No members added yet. Start by inviting members.
						</p>
					</div>
				)}
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={addMembersMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={addMembersMutation.isPending || staged.length === 0}
					>
						{addMembersMutation.isPending ? "Adding..." : "Add Member"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

