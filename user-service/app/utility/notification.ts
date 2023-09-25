import twilio from "twilio";

const accountSid = "ACcb1f111751c78f9569465e085fd2edd7";
const authToken = "b2bf75f87fe12d2a8b81ce8a4f1f5ce7";

const client = twilio(accountSid, authToken);

export const GenerateAccessCode = () => {
	const code = Math.floor(10000 + Math.random() * 900000);
	let expiry = new Date();
	expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
	return { code, expiry };
};

export const SendVerificationCode = async (
	code: number,
	toPhoneNumber: string
) => {
	const response = await client.messages.create({
		body: `Your verification code is ${code} it will expire within 30 minutes.`,
		from: "+17657393049",
		to: toPhoneNumber.trim(),
	});
	console.log(response);
	return response;
};
