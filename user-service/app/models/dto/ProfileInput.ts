import { Type } from "class-transformer";
import {
	IsDefined,
	IsNotEmptyObject,
	IsObject,
	Length,
	ValidateNested,
} from "class-validator";

export class AddressInput {
	@Length(3, 32)
	addressLine1: string;
	addressLine2: string;

	@Length(3, 12)
	city: string;

	@Length(4, 6)
	postCode: string;

	@Length(2, 3)
	country: string;
}

export class ProfileInput {
	@Length(3, 32)
	firstName: string;

	@Length(3, 32)
	lastName: string;

	@Length(5, 6)
	userType: string;

	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested({ each: true })
	@Type(() => AddressInput)
	address: AddressInput;
}
