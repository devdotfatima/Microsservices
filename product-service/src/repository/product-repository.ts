import { ProductDoc, products } from "../models/product-model";
import { ProductInput } from "../models/dto/product-input";

export class ProductRepository {
	constructor() {}

	async createProduct({
		name,
		description,
		price,
		category_id,
		image_url,
	}: ProductInput): Promise<ProductDoc> {
		return products.create({
			name,
			description,
			price,
			category_id,
			image_url,
			availability: true,
		});
	}

	async getAllProducts(offset = 0, pages?: number) {
		return products
			.find()
			.skip(offset)
			.limit(pages ? pages : 500);
	}
}
