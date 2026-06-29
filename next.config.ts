import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	logging: {
		browserToTerminal: false,
		serverFunctions: false
	},
	devIndicators: false,
	allowedDevOrigins: ["*.trycloudflare.com"]
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

