/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Express, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoInstance from './db/connect'
import deserializeUser from './middleware/deserializeUser'
import neo4j from './db/neo4j/Neo4jInstance'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import { CustomError } from './utils/ErrorSchema/ErrorSchema'
import sessionRoute from './routes/v1/SessionRoute'
dotenv.config()

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'http://localhost'
const app: Express = express()

// loading swagger
const path = require('path')
const swaggerPath = path.resolve(__dirname, '../swagger.yaml')
const swaggerDocument = YAML.load(swaggerPath)
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// loading middlewares
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
sessionRoute(app)
app.use(deserializeUser)

// loading routes
require('./routes/v1')(app)

// default handler
app.use((err: CustomError, req: Request, res: Response, next:NextFunction) => {
	console.log('********************** ERROR ***************')
	console.log('>>>> Request: ' + req.originalUrl)
	console.log(`Internal_Log >> ${err.message}`)
	console.log('At: ' + new Date())
	res.status(err?.status || 500)
	res.send(err.message)
})

const server = app.listen(PORT, async () => {
	await mongoInstance.connect()
	await neo4j.connect()
	console.log(`Running on ${HOST}:${PORT}/ ⚡ || ${process.env.NODE_ENV} mode`)
})

// Called when the server is either crashed or termininated
const cleanUpServer = async () => {
	server.close(async (err) => {
		if (err) console.log(err.message)
		else {
			await neo4j.disconnect()
			await mongoInstance.disconnect()
			process.exit()
		}
	})
}

const errorCodeArr = ['exit', 'SIGINT']

errorCodeArr.forEach((eventType) => {
	process.on(eventType, cleanUpServer.bind(null, eventType))
})
