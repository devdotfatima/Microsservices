import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartService } from "./../service/cartService";
import { CartRepository } from "./../repository/cartRepository";

const cartService = new CartService(new CartRepository());

export const CollectPayment = (event: APIGatewayProxyEventV2) => {
	return cartService.CollectPayment(event);
};
// export const GetOrders = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrders(event);
// }).use(bodyParser());

// export const OrderById = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrder(event);
// }).use(bodyParser());
