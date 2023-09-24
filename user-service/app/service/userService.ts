import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { AppValidationError } from "../utility/errors";
import {
	GetSalt,
	GetHashedPassword,
	ValidatePassword,
	GetToken,
	VerifyToken,
} from "../utility/password";

export class UserService {
	constructor() {}
	async CreateUser(event: APIGatewayProxyEventV2) {
		try {
			const input = plainToClass(SignupInput, event.body);
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);

			const salt = await GetSalt();
			const hashedPassword = await GetHashedPassword(input.password, salt);
			const data = await this.repository.createAccount({
				email: input.email,
				password: hashedPassword,
				phone: input.phone,
				userType: "BUYER",
				salt: salt,
			});

			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}
}
