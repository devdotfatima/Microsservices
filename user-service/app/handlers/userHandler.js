import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { UserService } from "../service/userService.js";

const service = new UserService();

export const Signup = middy((event) => {
	return service.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event) => {
	return service.UserLogin(event);
}).use(body());

export const Verify = async (event) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		return service.VerifyUser(event);
	} else if (httpMethod === "get") {
		return service.GetVerificationToken(event);
	} else {
		return ErrorResponse(404, "requested method is not supported!");
	}
};

export const Profile = async (event) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		return service.CreateProfile(event);
	} else if (httpMethod === "put") {
		return service.EditProfile(event);
	} else if (httpMethod === "get") {
		return service.GetProfile(event);
	} else {
		return ErrorResponse(404, "requested method is not supported!");
	}
};

export const Cart = async (event) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		return service.CreateCart(event);
	} else if (httpMethod === "put") {
		return service.UpdateCart(event);
	} else if (httpMethod === "get") {
		return service.GetCart(event);
	} else {
		return ErrorResponse(404, "requested method is not supported!");
	}
};

export const Payment = async (event) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		return service.CreatePaymentMethod(event);
	} else if (httpMethod === "put") {
		return service.UpdatePaymentMethod(event);
	} else if (httpMethod === "get") {
		return service.GetPaymentMethod(event);
	} else {
		return ErrorResponse(404, "requested method is not supported!");
	}
};
