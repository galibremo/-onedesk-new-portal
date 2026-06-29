export interface WhatsAppPhoneNumberInfo {
	phoneNumberId: string;
	displayPhoneNumber: string;
	verifiedName: string;
	wabaId: string;
	phoneNumberStatus: string;
}

export interface WhatsAppCallbackResult {
	accountId: string;
	phoneNumbers: WhatsAppPhoneNumberInfo[];
}
