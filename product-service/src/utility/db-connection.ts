import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
	const DB_URL = "mongodb+srv://******/product-microservice";

	try {
		await mongoose.connect(DB_URL);
	} catch (err) {
		console.log(err);
	}
};

export { ConnectDB };
