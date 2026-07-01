export const route = {
	public: {
		unauthorized: "/unauthorized",
		magicLinkVerify: "/auth/magic-link/verify"
	},
	private: {
		dashboard: "/",
		profile: "/profile",
		users: "/users",
		sessions: "/sessions",
		auditLogs: "/audit-logs",
		system: "/system",
		smtpProviders: "/smtp-providers",
		emailTemplates: "/email-templates",
		emailTemplateEdit: (publicId: string) => `/email-templates/${publicId}/edit`,
		emailLogs: "/email-logs",

		teams: "/teams",
		team: (publicId: string) => `/teams/${publicId}`,
		teamDetails: (publicId: string) => `/teams/${publicId}`,
		teamMembers: (publicId: string) => `/teams/${publicId}/members`,
		ticketInbox: (publicId: string) => `/teams/${publicId}/ticket-inbox`,
		chatInbox: (publicId: string) => `/teams/${publicId}/chat-inbox`,

		// integrations
		channels: "/channels"
	},
	protected: {
		login: "/login",
		magicLinkSuccess: "/auth/magic-link/success",
		twoFactorVerify: "/2fa/verify"
	}
} as const;

export const apiRoute = {
	csrf: "/csrf",
	passwordLogin: "/auth/login",
	googleLogin: "/auth/google",
	magicLinkRequest: "/auth/magic-link/request",
	magicLinkVerify: "/auth/magic-link/verify",
	twoFactorStatus: "/auth/2fa/status",
	twoFactorSetupStart: "/auth/2fa/setup/start",
	twoFactorSetupConfirm: "/auth/2fa/setup/confirm",
	twoFactorVerify: "/auth/2fa/verify",
	twoFactorDisable: "/auth/2fa/disable",
	twoFactorRecoveryCodesRegenerate: "/auth/2fa/recovery-codes/regenerate",
	me: "/auth/me",
	profile: "/auth/profile",
	profileImage: "/auth/profile/image",
	logout: "/auth/logout",
	users: "/users",
	user: (id: string) => `/users/${id}`,
	auditLogs: "/audit-logs",
	userRole: (id: string) => `/users/${id}/role`,
	userSessionsRevoke: (id: string) => `/users/${id}/sessions/revoke`,
	userTwoFactorReset: (id: string) => `/users/${id}/2fa/reset`,
	sessions: "/auth/sessions",
	sessionRevoke: (id: string) => `/auth/sessions/${id}/revoke`,
	revokeOtherSessions: "/auth/sessions/revoke-others",
	systemSettingsPublic: "/system/settings/public",
	systemSettings: "/system/settings",
	setPassword: "/auth/password/set",
	changePassword: "/auth/password/change",
	smtpProviders: "/smtp-providers",
	smtpProvider: (id: string) => `/smtp-providers/${id}`,
	smtpProviderTest: (id: string) => `/smtp-providers/${id}/test`,
	smtpProviderSetDefault: (id: string) => `/smtp-providers/${id}/set-default`,
	smtpProviderToggle: (id: string) => `/smtp-providers/${id}/toggle`,
	emailTemplates: "/email-templates",
	emailTemplate: (publicId: string) => `/email-templates/${publicId}`,
	emailLogs: "/email-logs",
	emailLog: (logId: string) => `/email-logs/${logId}`,
	emailLogResend: (logId: string) => `/email-logs/${logId}/resend`,

	// teams
	teams: "/teams",
	team: (id: string) => `/teams/${id}`,
	teamMembers: (id: string) => `/teams/${id}/members`,
	teamMembersRemove: (id: string) => `/teams/${id}/members`,
	teamMemberRole: (id: string, userId: string) => `/teams/${id}/members/${userId}/role`,

	// channels
	channels: "/channels",
	channel: (id: string) => `/channels/${id}`,

	// facebook
	facebookOAuthUrl: "/channels/facebook/oauth/url",
	facebookOAuthCallback: "/channels/facebook/oauth/callback",
	facebookPages: "/channels/facebook/pages",
	facebookPage: (id: string) => `/channels/facebook/pages/${id}`,
	facebookTokenRefresh: "/channels/facebook/token/refresh",

	// whatsapp
	whatsappOAuthUrl: "/channels/whatsapp/oauth/url",
	whatsappOAuthCallback: "/channels/whatsapp/oauth/callback",
	whatsappPhones: "/channels/whatsapp/phones",
	whatsappPhone: (id: string) => `/channels/whatsapp/phones/${id}`,
	whatsappTokenRefresh: "/channels/whatsapp/token/refresh",

	// instagram
	instagramOAuthUrl: "/channels/instagram/oauth/url",
	instagramOAuthCallback: "/channels/instagram/oauth/callback",
	instagramAccounts: "/channels/instagram/accounts",
	instagramTokenRefresh: "/channels/instagram/token/refresh"
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };

