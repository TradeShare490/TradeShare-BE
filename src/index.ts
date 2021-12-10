import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./db/connect";
import deserializeUser from "./middleware/deserializeUser";
dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost";
const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(deserializeUser);
require("./routes/v1")(app);

app.listen(PORT, async () => {
	await connect();
	console.log(`Running on ${HOST}:${PORT}/ ⚡ || ${process.env.NODE_ENV} mode`);
});
