import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SuccessResponse, ErrorResponse } from "../utility/response";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { VerifyToken } from "../utility/password";
import { CartRepository } from "../repository/cartRepository";
import { CartInput, UpdateCartInput } from "../models/dto/cartInput";
// import { CartItemModel } from "../models/CartItemsModel";
// import { PullData } from "../message-queue";
import aws from "aws-sdk";

@autoInjectable()
export class CartService {
	repository: CartRepository;
	constructor(repository: CartRepository) {
		this.repository = repository;
	}

	async ResponseWithError(event: APIGatewayProxyEventV2) {
		return ErrorResponse(404, "requested method is not supported!");
	}

	// Cart Section
	async CreateCart(event: APIGatewayProxyEventV2) {
		try {
			const token = event.headers.authorization;
			const payload = await VerifyToken(token);
			if (!payload) return ErrorResponse(403, "authorization failed");

			const input = plainToClass(CartInput, event.body);
			const error = await AppValidationError(input);
			if (error) {
				return ErrorResponse(404, error);
			}

			return SuccessResponse({ message: "Cart Created" });
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}
}
