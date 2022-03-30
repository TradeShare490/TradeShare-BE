
import express, { Express } from 'express'
import TrendingCompaniesController from '../../controllers/TrendingCompanies.controller'


const trendingCompaniesRoute = (app: Express) => {
    const TrendingController = new TrendingCompaniesController()
    const router = express.Router()

    router.get('/',async (req,res) => {
        await TrendingController.getTrendingCompanies(req,res);
    })
    app.use("/api/v1/trendingCompanies", router)
}

export default trendingCompaniesRoute;