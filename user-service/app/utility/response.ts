const formatResponse = (statusCode: number, message: string, data: unknown) => {
	if (data) {
		return {
			statusCode,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				message,
				data,
			}),
		};
	} else {
		return {
			statusCode,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				message,
			}),
		};
	}
};

export const SuccessResponse = (data: object) => {
	return formatResponse(200, "success", data);
};

export const ErrorResponse = (code = 1000, error: unknown) => {
	if (Array.isArray(error[0].children) && error[0].children.length > 0) {
		const errorObject = error[0].children[0].constraints;
		const errorMesssage =
			errorObject[Object.keys(errorObject)[0]] || "Error Occured";
		return formatResponse(code, errorMesssage, errorMesssage);
	}
	if (Array.isArray(error)) {
		const errorObject = error[0].constraints;
		const errorMesssage =
			errorObject[Object.keys(errorObject)[0]] || "Error Occured";
		return formatResponse(code, errorMesssage, errorMesssage);
	}
	return formatResponse(code, `${error}`, error);
};
