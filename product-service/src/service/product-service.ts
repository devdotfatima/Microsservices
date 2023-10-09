import { plainToClass } from "class-transformer";
import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { ProductInput } from "../models/dto/product-input";
import { AppValidationError } from "../utility/errors";

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
		return SuccessResponse({ msg: "Product Returned" });
	}
	async editProduct(event: APIGatewayEvent) {
		return SuccessResponse({ msg: "Products Edited" });
	}
	async deleteProduct(event: APIGatewayEvent) {
		return SuccessResponse({ msg: "Products Deleted" });
	}
}
