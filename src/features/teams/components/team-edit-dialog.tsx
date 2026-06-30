"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useUpdateTeamMutation } from "@/features/teams/actions/teams.mutations";
import {
	editTeamFormSchema,
	type EditTeamFormValues
} from "@/features/teams/schemas/team-form.schema";
import type { ManagedTeam, TeamStatus } from "@/features/teams/types/teams.types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { handleRequestError } from "@/lib/api/handle-request-error";

interface TeamEditDialogProps {
	team: ManagedTeam;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeamEditDialog({ team, open, onOpenChange }: TeamEditDialogProps) {
	const router = useRouter();
	const updateTeamMutation = useUpdateTeamMutation();

	const form = useForm<EditTeamFormValues>({
		resolver: zodResolver(editTeamFormSchema),
		defaultValues: { name: team.name, status: team.status }
	});

	const handleOpenChange = (next: boolean) => {
		if (next) {
			form.reset({ name: team.name, status: team.status });
		}
		onOpenChange(next);
	};

	const onSubmit = useCallback(
		(values: EditTeamFormValues) => {
			updateTeamMutation.mutate(
				{ id: team.id, name: values.name, status: values.status },
				{
					onSuccess: () => {
						toast.success("Team updated");
						onOpenChange(false);
					},
					onError: error => {
						handleRequestError(error, router, "Failed to update team");
					}
				}
			);
		},
		[updateTeamMutation, router, team.id, onOpenChange]
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
						<DialogHeader>
							<DialogTitle>Edit team</DialogTitle>
							<DialogDescription>{team.name}</DialogDescription>
						</DialogHeader>
						<FieldGroup className="gap-4">
							<Field>
								<FieldLabel htmlFor="edit-team-name">Name</FieldLabel>
								<Input
									id="edit-team-name"
									{...form.register("name")}
									placeholder="Team name"
									disabled={updateTeamMutation.isPending}
								/>
								{form.formState.errors.name ? (
									<p className="text-destructive text-sm">
										{form.formState.errors.name.message}
									</p>
								) : null}
							</Field>
							<Field>
								<FieldLabel htmlFor="edit-team-status">Status</FieldLabel>
								<Controller
									name="status"
									control={form.control}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={value => field.onChange(value as TeamStatus)}
											disabled={updateTeamMutation.isPending}
										>
											<SelectTrigger id="edit-team-status" className="w-full">
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ACTIVE">Active</SelectItem>
												<SelectItem value="INACTIVE">Inactive</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</Field>
						</FieldGroup>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={updateTeamMutation.isPending}>
								{updateTeamMutation.isPending ? "Saving" : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
