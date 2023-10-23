import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/userService.js";

const service = container.resolve(UserService);

export const Signup = (event: APIGatewayProxyEventV2) => {
	return service.CreateUser(event);
};

export const Login = (event: APIGatewayProxyEventV2) => {
	return service.UserLogin(event);
};

export const GetVerificationCode = (event: APIGatewayProxyEventV2) => {
	return service.GetVerificationToken(event);
};

export const Verify = (event: APIGatewayProxyEventV2) => {
	return service.VerifyUser(event);
};

export const CreateProfile = (event: APIGatewayProxyEventV2) => {
	return service.CreateProfile(event);
};

export const EditProfile = (event: APIGatewayProxyEventV2) => {
	return service.EditProfile(event);
};

export const GetProfile = (event: APIGatewayProxyEventV2) => {
	return service.GetProfile(event);
};
