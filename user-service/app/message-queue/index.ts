import axios from "axios";

// const PRODUCT_SERVICE_URL = "http://127.0.0.1:3000/products-queue";
// "https://kg4ae0v376.execute-api.eu-central-1.amazonaws.com/prod/products-queue"; //"; // it will be come from process.env
const PRODUCT_SERVICE_URL =
	"https://7ziu3v9n8d.execute-api.us-east-1.amazonaws.com/prod/products-queue";
export const PullData = async (requestData: Record<string, unknown>) => {
	return axios.post(PRODUCT_SERVICE_URL, requestData);
};
