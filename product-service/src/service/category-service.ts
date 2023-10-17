import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { CategoryInput } from "../models/dto/category-input";

export class CategoryService {
	repository: CategoryRepository;
	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async ResponseWithError(event: APIGatewayEvent) {
		return ErrorResponse(404, new Error("method not allowed!"));
	}

	async createCategory(event: APIGatewayEvent) {
		const input = plainToClass(CategoryInput, JSON.parse(event.body!));
		const error = await AppValidationError(input);
		if (error) return ErrorResponse(404, error);
		const data = await this.repository.createCategory(input);
		return SuccessResponse(data);
	}

	async getCategories(event: APIGatewayEvent) {
		const type = event.queryStringParameters?.type;
		if (type === "top") {
			const data = await this.repository.getTopCategories();
			return SuccessResponse(data);
		}
		const data = await this.repository.getAllCategories();
		return SuccessResponse(data);
	}
}
