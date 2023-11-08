import { Length, length } from "class-validator";

export class CategoryInput {
	id: string;

	@Length(3, 128)
	name: string;

	parentId?: string;

	products: string[];

	displayOrder: number;

	imageUrl: string;

	seller_id: number;
}

export class AddItemInput {
	@Length(3, 128)
	id: string;

	products: string[];
}
