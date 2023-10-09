import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
	const DB_URL =
		"mongodb+srv://dot:123@cluster0.hngqx9c.mongodb.net/product-microservice";

	try {
		await mongoose.connect(DB_URL);
	} catch (err) {
		console.log(err);
	}
};

export { ConnectDB };
