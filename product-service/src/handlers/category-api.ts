import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import "../utility";
import { CategoryRepository } from "../repository/category-repository";
import { CategoryService } from "../service/category-service";
const service = new CategoryService(new CategoryRepository());

export const createCategory = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.createCategory(event);
};

export const getCategory = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.getCategory(event);
};

export const getCategories = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.getCategories(event);
};

export const getSellerCategories = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.getAllSellerCategories(event);
};

export const editCategory = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.editCategory(event);
};

export const deleteCategory = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	return service.deleteCategory(event);
};
