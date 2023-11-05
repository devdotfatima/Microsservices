import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "../utility/response";
import { ProductService } from "../service/product-service";
import { ProductRepository } from "../repository/product-repository";
import "../utility";

const service = new ProductService(new ProductRepository());

export const createProduct = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.createProduct(event);
};

export const getProduct = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.getProduct(event);
};

export const getProducts = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.getProducts(event);
};

export const getSellerProducts = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.getSellerProducts(event);
};

export const editProduct = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.editProduct(event);
};

export const deleteProduct = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.deleteProduct(event);
};
