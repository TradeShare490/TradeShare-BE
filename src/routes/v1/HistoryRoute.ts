import express, { Express } from 'express'
import PortfolioHistoryController from '../../controllers/PorfolioHistoryController'

const historyRoute = (app: Express) => {
	const historyController = new PortfolioHistoryController()
	const router = express.Router()

	router.get('/:userId', (req, res) => {
		historyController.getHistory(req, res)
	})

	app.use('/api/v1/history/', router)
}

export default historyRoute
