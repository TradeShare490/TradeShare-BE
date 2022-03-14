import { Request, Response } from 'express'
import TrendingCompaniesService from "../db/service/trendingCompaniesService";
class TrendingCompaniesController {
  private topCompaniesService : TrendingCompaniesService;
  constructor(){
    this.topCompaniesService = new TrendingCompaniesService();
  }

  async getTrendingCompanies(req:Request,res:Response){
   return res.send(await this.topCompaniesService.getTrendingCompanies());
  }

}

export default TrendingCompaniesController;