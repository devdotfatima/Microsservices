const formatResponse = (statusCode, message, data = null) => {
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

export const SuccessResponse = (data) => {
	return formatResponse(200, "success", data);
};

export const ErrorResponse = (code = 1000, error) => {
	if (Array.isArray(error)) {
		const errorObject = error[0].constraints;
		const errorMesssage =
			errorObject[Object.keys(errorObject)[0]] || "Error Occured";
		return formatResponse(code, errorMesssage, errorMesssage);
	}

	return formatResponse(code, `${error}`, error);
};
