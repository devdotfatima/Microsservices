import { IsEmail, IsString, Length } from "class-validator";

export class LoginInput {
	@IsString()
	@IsEmail()
	email: string;
	@IsString()
	@Length(6, 32)
	password: string;
}
