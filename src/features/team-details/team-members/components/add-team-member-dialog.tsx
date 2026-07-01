"use client";

import { Cancel01Icon, PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { handleRequestError } from "@/lib/api/handle-request-error";

import { Creatable } from "@/components/common/react-select/creatable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface AddTeamMemberDialogProps {
	teamId: string;
	existingMemberEmails: string[];
}

interface StagedMember {
	email: string;
	role: TeamRole;
	name: string | null;
	image: string | null;
}

export function AddTeamMemberDialog({
	teamId,
	existingMemberEmails = []
}: AddTeamMemberDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const addMembersMutation = useAddTeamMembersMutation();
	const [staged, setStaged] = useState<StagedMember[]>([]);
	const [selectedEmail, setSelectedEmail] = useState("");
	const [selectedRole, setSelectedRole] = useState<TeamRole>("AGENT");
	const [pendingOption, setPendingOption] = useState<{ value: string; label: string } | null>(null);

	// Empty options - users create their own emails
	const emailOptions: { value: string; label: string }[] = [];

	const selectedEmailOption = useMemo(
		() => emailOptions.find(o => o.value === selectedEmail) ?? pendingOption,
		[emailOptions, selectedEmail, pendingOption]
	);

	const handleAddRow = useCallback(() => {
		if (!selectedEmail || !selectedEmail.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}

		const normalizedEmail = selectedEmail.toLowerCase();

		if (staged.some(m => m.email.toLowerCase() === normalizedEmail)) {
			toast.error("Email already added");
			return;
		}

		if (existingMemberEmails.some(e => e.toLowerCase() === normalizedEmail)) {
			toast.error("User is already a team member");
			return;
		}

		setStaged([...staged, { email: normalizedEmail, role: selectedRole, name: null, image: null }]);
		setSelectedEmail("");
		setPendingOption(null);
		setSelectedRole("AGENT");
	}, [selectedEmail, selectedRole, staged, existingMemberEmails]);

	const handleRemoveStaged = useCallback(
		(emailToRemove: string) => {
			setStaged(staged.filter(m => m.email !== emailToRemove));
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
				members: staged.map(m => ({ email: m.email, role: m.role }))
			},
			{
				onSuccess: data => {
					toast.success(`${data.added} member(s) added`);
					setOpen(false);
					setStaged([]);
					setSelectedEmail("");
					setPendingOption(null);
					setSelectedRole("AGENT");
				},
				onError: error => {
					handleRequestError(error, router, "Failed to add members");
				}
			}
		);
	}, [staged, addMembersMutation, teamId, router]);

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setStaged([]);
			setSelectedEmail("");
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
					<DialogDescription>Add members to your team.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6">
					<div className="grid gap-3">
						<h3 className="text-sm font-medium">Invite members</h3>
						<div className="flex items-end gap-3">
							<Field className="flex-1">
								<FieldLabel htmlFor="member-email">Email</FieldLabel>
								<Creatable
									inputId="member-email"
									value={selectedEmailOption}
									onChange={option => {
										const selected = option as { value: string; label: string } | null;
										if (selected && !Array.isArray(option)) {
											setSelectedEmail(selected.value);
											setPendingOption(selected);
										} else {
											setSelectedEmail("");
											setPendingOption(null);
										}
									}}
									options={emailOptions}
									isDisabled={addMembersMutation.isPending}
									placeholder="Enter email address..."
									isSearchable
									isClearable
									formatCreateLabel={inputValue => `Add "${inputValue}"`}
								/>
							</Field>
							<Field className="w-36 shrink-0">
								<FieldLabel htmlFor="member-role">Role</FieldLabel>
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
								disabled={addMembersMutation.isPending || !selectedEmail}
								className="shrink-0"
							>
								<HugeiconsIcon icon={PlusSignCircleIcon} className="size-4" />
							</Button>
						</div>
					</div>

					{staged.length > 0 ? (
						<>
							<Separator />
							<div className="grid gap-3">
								<h3 className="text-sm font-medium">Staged members ({staged.length})</h3>
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
												key={member.email}
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
													onClick={() => handleRemoveStaged(member.email)}
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
					) : (
						<div className="border-muted-foreground/30 rounded-lg border-2 border-dashed p-8 text-center">
							<p className="text-muted-foreground text-sm">
								No members added yet. Start by entering an email address.
							</p>
						</div>
					)}
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

