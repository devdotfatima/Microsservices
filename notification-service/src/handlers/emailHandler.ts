import { SQSEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { EmailInput } from "../dto/email-input";
import { AppValidationError } from "../utility/errors";
import { sendEmail } from "../utility/email";

export const CustomerEmailHandler = async (event: SQSEvent) => {
	try {
		const response: Record<string, unknown>[] = [];
		console.log("Email handler");
		const promisses = event.Records.map(async (record) => {
			const input = plainToClass(EmailInput, JSON.parse(record.body));
			const errors = await AppValidationError(input);
			console.log("ERRORS: ", JSON.stringify(errors));
			if (!errors) {
				const { to, name, order_number } = input;
				const bodyHtml = ` <html>
							<head>
							<title></title>
							</head>
							<body>
							<div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe"
							style="color
							:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data
							-muid="4838cf3-9892-4a6d-94d6-170e474d21e5">
							<h1>Hello Mr. ${name}</h1>
							<p>
							We have recieved your order. Thank you for business with us. Here is your order number for
							future reference: ${order_number}
							</p>
							<a class="Unsubscribe--unsubscribelink"
							href="{{{unsubscribe}}}" target="_blank" style="font-family:sans-serif; text-decoration:none;">
							Unsubscribe </a>
							
							</p>
							</div>
							</body>
 					</html>`;
				await sendEmail({ bodyHtml, subject: "Order Details", to: [to] });
			} else {
				response.push({ error: JSON.stringify(errors) });
			}
		});
		await Promise.all(promisses);
		console.log("SQS response:", response);

		return {};
	} catch (error) {
		console.log("ERRORS: ", JSON.stringify(error));
		return {};
	}
};
