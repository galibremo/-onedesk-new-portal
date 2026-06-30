"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateTeamMutation } from "@/features/teams/actions/teams.mutations";
import {
	createTeamFormSchema,
	type CreateTeamFormValues
} from "@/features/teams/schemas/team-form.schema";
import { handleRequestError } from "@/lib/api/handle-request-error";

export function CreateTeamDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const createTeamMutation = useCreateTeamMutation();

	const form = useForm<CreateTeamFormValues>({
		resolver: zodResolver(createTeamFormSchema),
		defaultValues: { name: "" }
	});

	const handleOpenChange = (next: boolean) => {
		if (next) form.reset({ name: "" });
		setOpen(next);
	};

	const onSubmit = useCallback(
		(values: CreateTeamFormValues) => {
			createTeamMutation.mutate(
				{ name: values.name.trim() },
				{
					onSuccess: () => {
						toast.success("Team created");
						setOpen(false);
					},
					onError: error => {
						handleRequestError(error, router, "Failed to create team");
					}
				}
			);
		},
		[createTeamMutation, router]
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button type="button" onClick={() => handleOpenChange(true)}>
				<HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
				Create team
			</Button>
			<DialogContent className="sm:max-w-lg">
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
					<DialogHeader>
						<DialogTitle>Create team</DialogTitle>
						<DialogDescription>
							The slug will be auto-generated from the team name.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="create-team-name">Name</FieldLabel>
							<Input
								id="create-team-name"
								{...form.register("name")}
								placeholder="e.g. Support Team"
								disabled={createTeamMutation.isPending}
							/>
							{form.formState.errors.name ? (
								<p className="text-destructive text-sm">
									{form.formState.errors.name.message}
								</p>
							) : null}
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={createTeamMutation.isPending}>
							{createTeamMutation.isPending ? "Creating" : "Create team"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
