import mongoose from "mongoose";
async function connect() {
	const DB_URI =
		process.env.DB_URI ||
		"mongodb+srv://damienleu:tradeshare@cluster0.s6elo.mongodb.net/tradesharedb?retryWrites=true&w=majority";

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
