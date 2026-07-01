"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxInput,
	ComboboxContent,
	ComboboxList,
	ComboboxItem,
	ComboboxEmpty
} from "@/components/ui/combobox";
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
import { handleRequestError } from "@/lib/api/handle-request-error";

interface AddTeamMemberDialogProps {
	teamId: string;
	existingMemberIds: string[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface StagedMember {
	userId: string;
	role: TeamRole;
	name: string | null;
	email: string;
	image: string | null;
}

export function AddTeamMemberDialog({
	teamId,
	existingMemberIds,
	open,
	onOpenChange
}: AddTeamMemberDialogProps) {
	const router = useRouter();
	const addMembersMutation = useAddTeamMembersMutation();
	const [staged, setStaged] = useState<StagedMember[]>([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [selectedRole, setSelectedRole] = useState<TeamRole>("AGENT");

	const usersQuery = useUsersQuery({
		page: 1,
		pageSize: 100,
		sort: "name",
		dir: "asc"
	});

	const availableUsers = useMemo(() => {
		const rows = usersQuery.data?.rows ?? [];
		return rows.filter(
			u => u.role !== "SUPER_ADMIN" && !existingMemberIds.includes(u.id) && !staged.some(s => s.userId === u.id)
		);
	}, [usersQuery.data, existingMemberIds, staged]);

	const handleAddRow = useCallback(() => {
		if (!selectedUserId) {
			toast.error("Please select a user");
			return;
		}

		const user = availableUsers.find(u => u.id === selectedUserId);
		if (!user) return;

		const newMember: StagedMember = {
			userId: user.id,
			role: selectedRole,
			name: user.name,
			email: user.email,
			image: user.image
		};

		setStaged([...staged, newMember]);
		setSelectedUserId("");
		setSelectedRole("AGENT");
	}, [selectedUserId, selectedRole, availableUsers, staged]);

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
					onOpenChange(false);
					setStaged([]);
					setSelectedUserId("");
					setSelectedRole("AGENT");
				},
				onError: error => {
					handleRequestError(error, router, "Failed to add members");
				}
			}
		);
	}, [staged, addMembersMutation, teamId, router, onOpenChange]);

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setStaged([]);
			setSelectedUserId("");
			setSelectedRole("AGENT");
		}
		onOpenChange(next);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
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
								<Combobox
									value={selectedUserId}
									onValueChange={value => {
										if (value !== null) setSelectedUserId(value);
									}}
								>
									<ComboboxInput
										placeholder="Search by name or email..."
										id="member-search"
										disabled={addMembersMutation.isPending || usersQuery.isLoading}
									>
										<ComboboxContent>
											<ComboboxList>
												{availableUsers.length === 0 ? (
													<ComboboxEmpty>No users available</ComboboxEmpty>
												) : (
													availableUsers.map(u => (
														<ComboboxItem
															key={u.id}
															value={u.id}
															className="flex items-center gap-2"
														>
															<Avatar className="size-6">
																{u.image ? (
																	<AvatarImage src={u.image} alt={u.name ?? ""} />
																) : null}
																<AvatarFallback className="text-xs">
																	{(u.name ?? u.email)
																		.split(" ")
																		.map(w => w[0])
																		.join("")
																		.toUpperCase()
																		.slice(0, 2)}
																</AvatarFallback>
															</Avatar>
															<div>
																<div className="text-sm font-medium">
																	{u.name ?? u.email}
																</div>
																{u.name ? (
																	<div className="text-muted-foreground text-xs">
																		{u.email}
																	</div>
																) : null}
															</div>
														</ComboboxItem>
													))
												)}
											</ComboboxList>
										</ComboboxContent>
									</ComboboxInput>
								</Combobox>
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
										<SelectItem value="TEAM_LEAD">
											{formatTeamRole("TEAM_LEAD")}
										</SelectItem>
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
