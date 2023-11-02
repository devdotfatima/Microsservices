import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SellerService } from "../service/sellerService.js";
import { SellerRepository } from "../repository/sellerRepository.js";

const service = new SellerService(new SellerRepository());

export const JoinSellerProgram = (event: APIGatewayProxyEventV2) => {
	return service.JoinSellerProgram(event);
};

export const GetPaymentMethods = (event: APIGatewayProxyEventV2) => {
	return service.GetPaymentMethods(event);
};

export const EditPaymentMethods = (event: APIGatewayProxyEventV2) => {
	return service.EditPaymentMethods(event);
};
