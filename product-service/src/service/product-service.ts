import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SucessResponse } from "../utility/response";
// import { plainToClass } from "class-transformer";
// import { AppValidationError } from "../utility/errors";
// import { ProductInput } from "../dto/product-input";
// import { CategoryRepository } from "../repository/category-repository";

// export class ProductService {
//   _repository: ProductRepository;
//   constructor(repository: ProductRepository) {
//     this._repository = repository;
//   }

//   async createProduct(event: APIGatewayEvent) {
//     const input = plainToClass(ProductInput, JSON.parse(event.body!));
//     const error = await AppValidationError(input);
//     if (error) return ErrorResponse(404, error);

//     const data = await this._repository.createProduct(input);

//     await new CategoryRepository().addItem({
//       id: input.category_id,
//       products: [data._id],
//     });
//     return SucessResponse(data);
//   }

//   async getProducts(event: APIGatewayEvent) {
//     const data = await this._repository.getAllProducts();
//     return SucessResponse(data);
//   }

//   async getProduct(event: APIGatewayEvent) {
//     const productId = event.pathParameters?.id;
//     if (!productId) return ErrorResponse(403, "please provide product id");

//     const data = await this._repository.getProductById(productId);
//     return SucessResponse(data);
//   }

//   async editProduct(event: APIGatewayEvent) {
//     const productId = event.pathParameters?.id;
//     if (!productId) return ErrorResponse(403, "please provide product id");

//     const input = plainToClass(ProductInput, JSON.parse(event.body!));
//     const error = await AppValidationError(input);
//     if (error) return ErrorResponse(404, error);

//     input.id = productId;
//     const data = await this._repository.updateProduct(input);

//     return SucessResponse(data);
//   }

//   async deleteProduct(event: APIGatewayEvent) {
//     const productId = event.pathParameters?.id;
//     if (!productId) return ErrorResponse(403, "please provide product id");

//     const { category_id, deleteResult } = await this._repository.deleteProduct(
//       productId
//     );
//     await new CategoryRepository().addItem({
//       id: category_id,
//       products: [productId],
//     });
//     return SucessResponse(deleteResult);
//   }
// }

export class ProductService {
	repository: ProductRepository;
	constructor(repository: ProductRepository) {
		this.repository = repository;
	}
	async createProduct(event: APIGatewayEvent) {
		return SucessResponse({ msg: "Product Created" });
	}
	async getProducts(event: APIGatewayEvent) {
		return SucessResponse({ msg: "Products Returned" });
	}
	async getProduct(event: APIGatewayEvent) {
		return SucessResponse({ msg: "Product Returned" });
	}
	async editProduct(event: APIGatewayEvent) {
		return SucessResponse({ msg: "Products Edited" });
	}
	async deleteProduct(event: APIGatewayEvent) {
		return SucessResponse({ msg: "Products Deleted" });
	}
}
