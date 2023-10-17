import { plainToClass } from "class-transformer";
import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { ProductInput } from "../models/dto/product-input";
import { AppValidationError } from "../utility/errors";
import { CategoryRepository } from "../repository/category-repository";

export class ProductService {
	repository: ProductRepository;
	constructor(repository: ProductRepository) {
		this.repository = repository;
	}

	async createProduct(event: APIGatewayEvent) {
		try {
			const input = plainToClass(ProductInput, JSON.parse(event.body!));
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);
			const data = await this.repository.createProduct(input);
			await new CategoryRepository().addItem({
				id: input.category_id,
				products: [data._id],
			});
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async getProducts(event: APIGatewayEvent) {
		const data = await this.repository.getAllProducts();
		return SuccessResponse(data);
	}

	async getProduct(event: APIGatewayEvent) {
		const productId = event.pathParameters?.id;
		if (!productId) return ErrorResponse(403, "please provide product id");

		const data = await this.repository.getProductById(productId);
		return SuccessResponse(data);
	}

	async editProduct(event: APIGatewayEvent) {
		const productId = event.pathParameters?.id;
		if (!productId) return ErrorResponse(403, "please provide product id");

		const input = plainToClass(ProductInput, JSON.parse(event.body!));
		const error = await AppValidationError(input);
		if (error) return ErrorResponse(404, error);

		input.id = productId;
		const data = await this.repository.updateProduct(input);

		return SuccessResponse(data);
	}

	async deleteProduct(event: APIGatewayEvent) {
		const productId = event.pathParameters?.id;
		if (!productId) return ErrorResponse(403, "please provide product id");

		const { category_id, deleteResult } = await this.repository.deleteProduct(
			productId
		);
		await new CategoryRepository().addItem({
			id: category_id,
			products: [productId],
		});
		return SuccessResponse(deleteResult);
	}
}
