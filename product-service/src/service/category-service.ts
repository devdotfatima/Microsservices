import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { CategoryInput } from "../models/dto/category-input";
import { AuthUser } from "../utility/auth";

export class CategoryService {
	repository: CategoryRepository;
	constructor(repository: CategoryRepository) {
		this.repository = repository;
	}

	async ResponseWithError(event: APIGatewayEvent) {
		return ErrorResponse(404, new Error("method not allowed!"));
	}

	async authorisedUser(user_id: number, categoryId: string) {
		const category = await this.repository.getCategoryById(categoryId);
		if (!category) return false;
		return Number(user_id) === Number(category.seller_id);
	}

	async createCategory(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");
			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to create category"
				);
			}

			const input = plainToClass(CategoryInput, JSON.parse(event.body!));
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);
			const data = await this.repository.createCategory({
				...input,
				seller_id: user.user_id,
			});
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async getCategories(event: APIGatewayEvent) {
		try {
			const type = event.queryStringParameters?.type;
			if (type === "top") {
				const data = await this.repository.getTopCategories();
				return SuccessResponse(data);
			}
			const data = await this.repository.getAllCategories();
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async getAllSellerCategories(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");

			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to manage categories"
				);
			}

			const data = await this.repository.getAllSellerCategories(user.user_id);
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async getCategory(event: APIGatewayEvent) {
		try {
			const categoryId = event.pathParameters?.id;
			const offset = Number(event.queryStringParameters?.offset);
			const perPage = Number(event.queryStringParameters?.perPage);

			if (!categoryId) return ErrorResponse(403, "please provide category id");
			const data = await this.repository.getCategoryById(
				categoryId,
				offset,
				perPage
			);
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async editCategory(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");

			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to manage categories"
				);
			}

			const categoryId = event.pathParameters?.id;
			if (!categoryId) return ErrorResponse(403, "please provide category id");

			const input = plainToClass(CategoryInput, JSON.parse(event.body!));
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);

			const isAuthorised = await this.authorisedUser(user.user_id, categoryId);
			if (!isAuthorised)
				return ErrorResponse(
					403,
					"you are not authorised to edit this categories"
				);

			input.id = categoryId;
			const data = await this.repository.updateCategory(input);
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async deleteCategory(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");

			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to manage categories"
				);
			}

			const categoryId = event.pathParameters?.id;
			if (!categoryId) return ErrorResponse(403, "please provide category id");

			const isAuthorised = await this.authorisedUser(user.user_id, categoryId);
			if (!isAuthorised)
				return ErrorResponse(
					403,
					"you are not authorised to delete this category"
				);

			const data = await this.repository.deleteCategory(categoryId);
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}
}
