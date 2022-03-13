
import express, { Express } from 'express'
import TrendingCompaniesController from '../../controllers/TrendingCompanies.controller'


const trendingCompaniesRoute = (app: Express) => {
    const TrendingController = new TrendingCompaniesController()
    const router = express.Router()

    //Someone please correct this cause I don't know what to do from here
    router.get('/',async (req,res) => {
        await TrendingController.getTrendingCompanies(req,res);
    })
}

export default trendingCompaniesRoute;