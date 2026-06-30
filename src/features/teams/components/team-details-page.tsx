import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

export default function TeamDetailsPage() {
	const breadcrumbItems = [
		{ name: "Dashboard", href: route.private.dashboard },
		{ name: "Teams", href: route.private.teams },
		{ name: "Team Details", isCurrent: true }
	];
	return (
		<div>
			<SetBreadcrumb items={breadcrumbItems} />
		</div>
	);
}

