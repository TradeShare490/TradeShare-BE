import { Express, Request, Response } from 'express'
import DefaultService from '../../db/service/DefaultService'

const defaultRoute = (app: Express) => {
	const defaultService = new DefaultService()

	app.get('/', (req: Request, res: Response) => {
		res.send(defaultService.hello())
	})

	app.get('/api/check', (req: Request, res: Response) => {
		res.send(defaultService.apiCheck())
	})

	// app.get('*', (req: Request, res:Response) => {
	//   res.send(defaultService.notFound())
	// })
}

export default defaultRoute
