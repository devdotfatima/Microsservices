import { IsString, Length } from "class-validator";
import { LoginInput } from "./LoginInput";

export class SignupInput extends LoginInput {
	@IsString()
	@Length(10, 13)
	phone: string;
}
