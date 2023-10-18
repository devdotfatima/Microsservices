import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { CartService } from "./../service/cartService";
// import { CartRepository } from "./../repository/cartRepository";

// const cartService = new CartService(new CartRepository());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		// return service.CreateCart(event);
	} else if (httpMethod === "put") {
		// return service.UpdateCart(event);
	} else if (httpMethod === "get") {
		// return service.GetCart(event);
	} else {
		// return service.ResponseWithError(event);
	}
}).use(bodyParser());

// export const CreateCart = middy((event: APIGatewayProxyEventV2) => {
// 	return cartService.CreateCart(event);
// }).use(bodyParser());

// export const DeleteCart = middy((event: APIGatewayProxyEventV2) => {
// 	return cartService.DeleteCart(event);
// }).use(bodyParser());

// export const EditCart = middy((event: APIGatewayProxyEventV2) => {
// 	return cartService.UpdateCart(event);
// }).use(bodyParser());

// export const GetCart = middy((event: APIGatewayProxyEventV2) => {
// 	return cartService.GetCart(event);
// }).use(bodyParser());
