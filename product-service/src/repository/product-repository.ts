import { ProductDoc, products } from "../models";
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

	async getProductById(id: string) {
		return products.findById(id);
	}

	async updateProduct({
		id,
		name,
		description,
		price,
		category_id,
		image_url,
		availability,
	}: ProductInput) {
		let existingProduct = (await products.findById(id)) as ProductDoc;
		existingProduct.name = name;
		existingProduct.description = description;
		existingProduct.price = price;
		existingProduct.category_id = category_id;
		existingProduct.image_url = image_url;
		existingProduct.availability = availability;
		return existingProduct.save();
	}

	async deleteProduct(id: string) {
		const { category_id } = (await products.findById(id)) as ProductDoc;
		const deleteResult = await products.deleteOne({ _id: id });
		return { category_id, deleteResult };
	}
}
