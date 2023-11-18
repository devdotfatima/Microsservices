import aws from "aws-sdk";
// Set the region
aws.config.update({ region: "eu-central-1" });

// Create an SES client
const ses = new aws.SES();

const FROM_EMAIL = "bibliophilemuffie@gmail.com";

export interface EmailTemplate {
	to: string[];
	subject: string;
	bodyHtml: string;
}

export const sendEmail = async (template: EmailTemplate) => {
	const params: aws.SES.SendEmailRequest = {
		Destination: {
			ToAddresses: template.to,
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: template.bodyHtml,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: template.subject,
			},
		},
		Source: FROM_EMAIL,
	};

	try {
		const data = await ses.sendEmail(params).promise();
		console.log("Email sent! Message ID:", data.MessageId);
		return true;
	} catch (error) {
		console.error("Error sending email:", error);

		return false; // Re-throw the error for handling in the calling code
	}
};
