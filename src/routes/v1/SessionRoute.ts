import express, { Express } from 'express'
import SessionController from '../../controllers/SessionController'
import { createSessionSchema } from '../../db/schema/session.schema'
import requireUser from '../../middleware/requireUser'
import validateResource from '../../middleware/validateResource'
const sessionRoute = (app: Express) => {
	const sessionController = new SessionController()
	const router = express.Router()

	// All paths have the prefix /api/v1/session/

	// router.use("/", validateResource(createSessionSchema));

	router.post('/', validateResource(createSessionSchema), (req, res) => {
		sessionController.createSession(req, res)
	})

	router.get('/', requireUser, (req, res) => {
		sessionController.getSession(req, res)
	})

	router.delete('/', requireUser, (req, res) => {
		sessionController.deleteSession(req, res)
	})

	app.use('/api/v1/session/', router)
}

export default sessionRoute
