import twilio from "twilio";

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const SendVerificationCode = async (
	code: number,
	toPhoneNumber: string
) => {
	const response = await client.messages.create({
		body: `Your verification code is ${code} it will expire within 30 minutes.`,
		from: "+17657393049",
		to: toPhoneNumber.trim(),
	});
	return response;
};
