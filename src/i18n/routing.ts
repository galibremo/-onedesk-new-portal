import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "bn"],
	localePrefix: "never",
	defaultLocale: "en"
});

