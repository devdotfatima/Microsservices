import { CartItemModel } from "../models/CartItemModel";
import { ShoppingCartModel } from "../models/ShoppingCartModel";
import { DBOperation } from "./dbOperation";

export class CartRepository extends DBOperation {
	constructor() {
		super();
	}

	async findShoppingCart(userId: number) {
		const queryString =
			"SELECT cart_id, user_id from shopping_carts WHERE user_id=$1";
		const values = [userId];
		const result = await this.executeQuery(queryString, values);
		if (result.rowCount < 1) {
			return false;
		}
		return result.rows[0] as ShoppingCartModel;
	}

	async createShoppingCart(userId: number) {
		const queryString =
			"INSERT INTO shopping_carts (user_id) VALUES ($1) RETURNING *";
		const values = [userId];
		const result = await this.executeQuery(queryString, values);
		if (result.rowCount < 1) {
			return false;
		}
		return result.rows[0] as ShoppingCartModel;
	}

	async findCartItemById(cartId: number) {}

	async findCartItemByProductId(productId: string, cartId: number) {
		const queryString =
			"SELECT product_id, price, item_qty FROM cart_items WHERE product_id=$1 AND cartId=$2 ";
		const values = [productId, cartId];
		const result = await this.executeQuery(queryString, values);
		if (result.rowCount < 1) {
			return false;
		}
		return result.rows[0] as CartItemModel;
	}
}
