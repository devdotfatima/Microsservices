module.exports.handler = async (event) => {
	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "8",
		},
		body: JSON.stringify({
			message: "Response from signup functionnnnnnnnn",
			input: event,
			data: {},
		}),
	};
};
