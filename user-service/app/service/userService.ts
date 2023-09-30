import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { autoInjectable } from "tsyringe";
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
import { UserRepository } from "../repository/userRepository";
import { LoginInput } from "../models/dto/LoginInput";
import {
	GenerateAccessCode,
	SendVerificationCode,
} from "../utility/notification";
import { VerificationInput } from "../models/dto/VerificationInput";
import { TimeDifference } from "../utility/datehelper";
import { ProfileInput } from "../models/dto/ProfileInput";

@autoInjectable()
export class UserService {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}
	async ResponseWithError(event: APIGatewayProxyEventV2) {
		return ErrorResponse(404, "requested method is not supported!");
	}
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

	async UserLogin(event: APIGatewayProxyEventV2) {
		try {
			const input = plainToClass(LoginInput, event.body);
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);
			const data = await this.repository.findAccount(input.email);
			const verified = await ValidatePassword(
				input.password,
				data.password,
				data.salt
			);
			if (!verified) {
				throw new Error("Invalid Credentials");
			}
			const token = GetToken(data);

			return SuccessResponse({ token });
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async GetVerificationToken(event: APIGatewayProxyEventV2) {
		const token = event.headers.authorization;
		const payload = await VerifyToken(token);
		if (!payload) return ErrorResponse(403, "authorization failed");

		const { code, expiry } = GenerateAccessCode();
		await this.repository.updateVerificationCode(payload.user_id, code, expiry);
		const response = await SendVerificationCode(code, payload.phone);
		return SuccessResponse({
			message: "verification code is sent to your registered mobile number!",
		});
	}

	async VerifyUser(event: APIGatewayProxyEventV2) {
		const token = event.headers.authorization;
		const payload = await VerifyToken(token);
		if (!payload) return ErrorResponse(403, "authorization failed");

		const input = plainToClass(VerificationInput, event.body);
		const error = await AppValidationError(input);
		if (error) return ErrorResponse(404, error);
		const { verification_code, expiry } = await this.repository.findAccount(
			payload.email
		);
		if (verification_code === parseInt(input.code)) {
			const currentTime = new Date();
			const diff = TimeDifference(expiry, currentTime.toISOString(), "m");
			if (diff > 0) {
				await this.repository.updateVerifyUser(payload.user_id);
			} else {
				return ErrorResponse(403, "verification code is expired");
			}
		}
		return SuccessResponse({ message: "User verified" });
	}

	async CreateProfile(event: APIGatewayProxyEventV2) {
		const token = event.headers.authorization;
		const payload = await VerifyToken(token);
		if (!payload) return ErrorResponse(403, "authorization failed");

		const input = plainToClass(ProfileInput, event.body);
		const error = await AppValidationError(input);
		if (error) {
			return ErrorResponse(404, error);
		}

		const result = await this.repository.createUserProfile(
			payload.user_id,
			input
		);

		return SuccessResponse({ message: "User verified" });
	}

	async EditProfile(event: APIGatewayProxyEventV2) {
		const token = event.headers.authorization;
		const payload = await VerifyToken(token);
		if (!payload) return ErrorResponse(403, "authorization failed");
	}

	async GetProfile(event: APIGatewayProxyEventV2) {
		const token = event.headers.authorization;
		const payload = await VerifyToken(token);
		if (!payload) return ErrorResponse(403, "authorization failed");
	}
}
