import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

export default function TeamDetailsPage({ slug }: { slug: string }) {
	const breadcrumbItems = [
		{ name: "Dashboard", href: route.private.dashboard },
		{ name: "Teams", href: route.private.teams },
		{ name: slug, isCurrent: true }
	];
	return (
		<div>
			<SetBreadcrumb items={breadcrumbItems} />
		</div>
	);
}

