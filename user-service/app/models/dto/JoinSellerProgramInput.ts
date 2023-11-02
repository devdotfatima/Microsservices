import { Length } from "class-validator";
import { AddressInput } from "./ProfileInput";

export class PaymentMethodInput {
	@Length(6, 24)
	bankAccountNumber: string;

	@Length(6, 12)
	swiftCode: string;

	@Length(6, 12)
	paymentType: string;
}

export class SellerProgramInput extends PaymentMethodInput {
	userType: string;

	@Length(3, 16)
	firstName: string;

	@Length(3, 16)
	lastName: string;

	@Length(10, 13)
	phone: string;

	address: AddressInput;
}
