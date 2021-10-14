import mongoose from "mongoose";
import config from "./../config/config";
async function connect() {

    const DB_URI = config.dbUri;

    return await mongoose
        .connect(DB_URI)
        .then(() => {
            console.log("Database connected");
        })
        .catch((error) => {
            console.log("DB error", error);
        })
}

export default connect