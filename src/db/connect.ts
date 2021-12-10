import mongoose from "mongoose";
async function connect() {
	const DB_URI = process.env.DB_URI;
	if (!DB_URI) {
		console.log("ERROR: DB_URI not found. Please check if mongodb url exists in your .env file");
		process.exit(-1);
	}
	return await mongoose
		.connect(DB_URI)
		.then(() => {
			console.log("Database connected");
		})
		.catch((error) => {
			console.log("DB error", error);
		});
}

export default connect;
