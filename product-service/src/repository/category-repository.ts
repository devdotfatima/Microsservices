import { AddItemInput, CategoryInput } from "../models/dto/category-input";
import { CategoryDoc, categories } from "../models";

export class CategoryRepository {
	constructor() {}

	async createCategory({ name, parentId, imageUrl }: CategoryInput) {
		// create a new category
		const newCategory = await categories.create({
			name,
			parentId,
			subCategory: [],
			products: [],
			imageUrl,
		});
		// parent id exist
		// update parent category with the new sub category id
		if (parentId) {
			const parentCategory = (await categories.findById(
				parentId
			)) as CategoryDoc;
			parentCategory.subCategories = [
				...parentCategory.subCategories,
				newCategory,
			];
			await parentCategory.save();
		}
		// return newly create category

		return newCategory;
	}
}
