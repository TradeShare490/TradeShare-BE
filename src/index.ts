import express, { Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import connect from "./db/connect";

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'http://localhost'
const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

require('./routes/v1')(app);

app.listen(PORT, async () => {
    console.log(`Running on ${HOST}:${PORT}/ ⚡ || ${process.env.NODE_ENV} mode`)
    await connect();
});
