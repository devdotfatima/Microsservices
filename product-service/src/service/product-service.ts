import { plainToClass } from "class-transformer";
import { APIGatewayEvent, APIGatewayProxyEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { ProductInput } from "../models/dto/product-input";
import { AppValidationError } from "../utility/errors";
import { CategoryRepository } from "../repository/category-repository";
import { ServiceInput } from "../models/dto/service-input";
import { AuthUser } from "../utility/auth";

export class ProductService {
	repository: ProductRepository;
	constructor(repository: ProductRepository) {
		this.repository = repository;
	}

	async authorisedUser(user_id: number, productId: string) {
		const product = await this.repository.getProductById(productId);
		if (!product) return false;
		return Number(user_id) === Number(product.seller_id);
	}

	async createProduct(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");
			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to create product"
				);
			}

			const input = plainToClass(ProductInput, JSON.parse(event.body!));
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);

			const data = await this.repository.createProduct({
				...input,
				seller_id: user.user_id,
			});

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
		try {
			const data = await this.repository.getAllProducts();
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async getSellerProducts(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");

			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to manage product"
				);
			}

			const data = await this.repository.getAllSellerProducts(user.user_id);
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async getProduct(event: APIGatewayEvent) {
		try {
			const productId = event.pathParameters?.id;
			if (!productId) return ErrorResponse(403, "please provide product id");

			const data = await this.repository.getProductById(productId);
			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async editProduct(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");

			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to manage product"
				);
			}

			const productId = event.pathParameters?.id;
			if (!productId) return ErrorResponse(403, "please provide product id");

			const input = plainToClass(ProductInput, JSON.parse(event.body!));
			const error = await AppValidationError(input);
			if (error) return ErrorResponse(404, error);

			const isAuthorised = await this.authorisedUser(user.user_id, productId);
			if (!isAuthorised)
				return ErrorResponse(
					403,
					"you are not authorised to edit this product"
				);

			input.id = productId;
			const data = await this.repository.updateProduct(input);

			return SuccessResponse(data);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	async deleteProduct(event: APIGatewayEvent) {
		try {
			const token = event.headers.Authorization;
			const user = await AuthUser(token);
			if (!user) return ErrorResponse(403, "authorization failed");

			if (user.user_type.toUpperCase() !== "SELLER") {
				return ErrorResponse(
					403,
					"you need to join the seller program to manage products"
				);
			}

			const productId = event.pathParameters?.id;
			if (!productId) return ErrorResponse(403, "please provide product id");

			const isAuthorised = await this.authorisedUser(user.user_id, productId);
			if (!isAuthorised)
				return ErrorResponse(
					403,
					"you are not authorised to delete this product"
				);

			const { category_id, deleteResult } = await this.repository.deleteProduct(
				productId
			);

			await new CategoryRepository().removeItem({
				id: category_id,
				products: [productId],
			});

			return SuccessResponse(deleteResult);
		} catch (error) {
			console.log(error);
			return ErrorResponse(500, error);
		}
	}

	// http calls // later stage we will convert this thing to RPC & Queue
	async handleQueueOperation(event: APIGatewayProxyEvent) {
		console.log("here");
		const input = plainToClass(ServiceInput, JSON.parse(event.body!));
		const error = await AppValidationError(input);
		if (error) return ErrorResponse(404, error);

		console.log("INPUT", input);

		const { _id, name, price, image_url } =
			await this.repository.getProductById(input.productId);
		console.log("PRODUCT DETAILS", { _id, name, price, image_url });

		return SuccessResponse({
			product_id: _id,
			name,
			price,
			image_url,
		});
	}
}
