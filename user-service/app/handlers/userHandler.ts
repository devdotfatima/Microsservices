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

// export const Verify = middy((event: APIGatewayProxyEventV2) => {
// 	const httpMethod = event.requestContext.http.method.toLowerCase();
// 	if (httpMethod === "post") {
// 		return service.VerifyUser(event);
// 	} else if (httpMethod === "get") {
// 		return service.GetVerificationToken(event);
// 	} else {
// 		return service.ResponseWithError(event);
// 	}
// }).use(bodyParser());

export const Verify = (event: APIGatewayProxyEventV2) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		return service.VerifyUser(event);
	} else if (httpMethod === "get") {
		return service.GetVerificationToken(event);
	} else {
		return service.ResponseWithError(event);
	}
};

export const Profile = (event: APIGatewayProxyEventV2) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		return service.CreateProfile(event);
	} else if (httpMethod === "put") {
		return service.EditProfile(event);
	} else if (httpMethod === "get") {
		return service.GetProfile(event);
	} else {
		return service.ResponseWithError(event);
	}
};

export const Payment = (event: APIGatewayProxyEventV2) => {
	const httpMethod = event.requestContext.http.method.toLowerCase();
	if (httpMethod === "post") {
		// return service.CreatePaymentMethod(event);
	} else if (httpMethod === "put") {
		// return service.UpdatePaymentMethod(event);
	} else if (httpMethod === "get") {
		// return service.GetPaymentMethod(event);
	} else {
		return service.ResponseWithError(event);
	}
};
