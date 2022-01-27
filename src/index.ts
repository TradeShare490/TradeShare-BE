import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import mongoInstance from "./db/connect";
import deserializeUser from "./middleware/deserializeUser";
import neo4j from "./db/neo4j/Neo4jInstance";
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

const server = app.listen(PORT, async () => {
	await mongoInstance.connect();
	await neo4j.connect();
	console.log(`Running on ${HOST}:${PORT}/ ⚡ || ${process.env.NODE_ENV} mode`);
});

// Called when the server is either crashed or termininated
// const cleanUpServer = async () => {
// 	server.close(async (err) => {
// 		if (err) console.log(err.message);
// 		else {
// 			await neo4j.disconnect();
// 			await mongoInstance.disconnect();
// 			console.log("exit ?");
// 			process.exit();
// 		}
// 	});
// };

// const errorCodeArr = [`exit`, `SIGINT`];

// errorCodeArr.forEach((eventType) => {
// 	process.on(eventType, cleanUpServer.bind(null, eventType));
// });
