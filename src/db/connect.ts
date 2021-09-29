import mongoose from "mongoose";

function connect() {
    const dbUri = "mongodb+srv://damienleu:tradeshare@cluster0.s6elo.mongodb.net/tradesharedb?retryWrites=true&w=majority";

    return mongoose
        .connect(dbUri)
        .then(() => {
            console.log("Database connected");
        })
        .catch((error) => {
            console.log("DB error", error);
        })
}

export default connect