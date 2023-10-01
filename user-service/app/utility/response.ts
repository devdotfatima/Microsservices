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
	console.log(error);

	if (Array.isArray(error)) {
		if (Array.isArray(error[0].children) && error[0].children.length > 0) {
			console.log("here");
			const errorObject = error[0].children[0].constraints;
			const errorMesssage =
				errorObject[Object.keys(errorObject)[0]] || "Error Occured";
			return formatResponse(code, errorMesssage, errorMesssage);
		}
		console.log("here");
		const errorObject = error[0].constraints;
		const errorMesssage =
			errorObject[Object.keys(errorObject)[0]] || "Error Occured";
		return formatResponse(code, errorMesssage, errorMesssage);
	}
	return formatResponse(code, `${error}`, error);
};
